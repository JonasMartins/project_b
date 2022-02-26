import { PubSubEngine } from "graphql-subscriptions";
import { ErrorFieldHandler } from "./../helpers/errorFieldHandler";
import {
    Arg,
    Ctx,
    Field,
    Mutation,
    ObjectType,
    PubSub,
    Query,
    Resolver,
    Root,
    Subscription,
} from "type-graphql";
import { Context } from "./../context";
import { Notification } from "./../database/entity/notification.entity";
import { User } from "./../database/entity/user.entity";
import { genericError } from "./../helpers/generalAuxMethods";
import { GeneralResponse, UserResponse } from "./../helpers/generalTypeReturns";
import e from "express";

@ObjectType()
class NotificationRespose {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];

    @Field(() => Notification, { nullable: true })
    notification?: Notification;
}

@ObjectType()
class NotificationsRespose {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];

    @Field(() => [Notification], { nullable: true })
    notifications?: Notification[];
}

@ObjectType()
class NotificationSubscription {
    @Field(() => Notification, { nullable: true })
    notification?: Notification;
}

@Resolver()
export class NotificationResolver {
    @Query(() => UserResponse)
    async getUserNotifications(
        @Arg("limit", () => Number, { nullable: true }) limit: number,
        @Arg("offset", () => Number, { nullable: true }) offset: number,
        @Arg("userId") userId: string,
        @Ctx() { em }: Context
    ): Promise<UserResponse> {
        try {
            const max = Math.min(20, limit ? limit : 20);
            const maxOffset = offset ? offset : 0;

            const qb = await em
                .getRepository(User)
                .createQueryBuilder("user")
                .leftJoinAndSelect("user.relatedNotifications", "notification")
                .leftJoinAndSelect("notification.creator", "nc")
                .select([
                    "user.id",
                    "notification.id",
                    "notification.createdAt",
                    "notification.description",
                    "notification.userSeen",
                    "nc.id",
                    "nc.name",
                    "nc.picture",
                ])
                .where("user.id = :id", { id: userId })
                .orderBy("notification.createdAt", "DESC")
                .take(max)
                .skip(maxOffset);

            const user = await qb.getOne();

            return { user };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "getUserNotifications",
                    __filename,
                    `Could not get the users, details: ${e.message}`
                ),
            };
        }
    }

    @Mutation(() => GeneralResponse)
    async addSeenNotification(
        @Arg("userId") userId: string,
        @Arg("notificationId") notificationId: string,
        @Ctx() { em }: Context
    ): Promise<GeneralResponse> {
        try {
            const notification = await em.findOne(Notification, {
                id: notificationId,
            });

            if (!notification) {
                return {
                    errors: genericError(
                        "-",
                        "addSeenNotification",
                        __filename,
                        `Could not find notification with id: ${notificationId}`
                    ),
                };
            }
            notification?.userSeen.push(userId);

            await em.save(notification);

            return { done: true };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "addSeenNotification",
                    __filename,
                    `${e.message}`
                ),
            };
        }
    }

    @Subscription(() => NotificationSubscription, {
        topics: "NOTIFICATION_CREATED",
    })
    async newNotificationSubscription(
        @Root("notification") notification: NotificationSubscription
    ): Promise<NotificationSubscription> {
        if (notification) {
            return { notification: notification.notification };
        } else {
            return {};
        }
    }

    @Mutation(() => NotificationRespose)
    async createNotification(
        @Arg("description") description: string,
        @Arg("creatorId") creatorId: string,
        @PubSub() pubSub: PubSubEngine,
        @Arg("usersRelatedIds", () => [String], { nullable: false })
        usersRelatedIds: string[],
        @Ctx() { em }: Context
    ): Promise<NotificationRespose> {
        try {
            const creator = await em.findOne(User, { id: creatorId });

            if (!creator) {
                return {
                    errors: genericError(
                        "-",
                        "createNotification",
                        __filename,
                        `Could not found user with id: ${creatorId}`
                    ),
                };
            }

            const usersRelated = await em
                .getRepository(User)
                .createQueryBuilder("user")
                .where("user.id IN (:...ids)", { ids: usersRelatedIds })
                .getMany();

            if (!usersRelated || !usersRelated.length) {
                return {
                    errors: genericError(
                        "-",
                        "createNotification",
                        __filename,
                        `Could not found participants for this notification`
                    ),
                };
            }

            const notification = await em.create(Notification, {
                description,
                creator,
                userSeen: [],
            });

            await em.save(notification);

            if (!notification) {
                return {
                    errors: genericError(
                        "-",
                        "createNotification",
                        __filename,
                        `Could not create the notification`
                    ),
                };
            }

            interface user_notifications_notification {
                notification_id: string;
                user_id: string;
            }

            let user_notifications: user_notifications_notification[] = [];

            usersRelatedIds.forEach((x) => {
                user_notifications.push({
                    user_id: x,
                    notification_id: notification.id,
                });
            });

            await em.connection
                .createQueryBuilder()
                .insert()
                .into("user_notifications_notification")
                .values(user_notifications)
                .execute();

            notification.realtedUsers = usersRelated;

            await pubSub.publish("NOTIFICATION_CREATED", {
                notification: {
                    notification: notification,
                },
            });

            return { notification: notification };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "createNotification",
                    __filename,
                    `${e.message}`
                ),
            };
        }
    }
}
