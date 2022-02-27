import React, { useEffect } from "react";
import type { NextPage } from "next";
import { Flex } from "@chakra-ui/react";
import { useNewNotificationSubscriptionSubscription } from "generated/graphql";
import { useUser } from "utils/hooks/useUser";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "Redux/Global/GlobalReducer";
import { bindActionCreators } from "redux";
import { actionCreators } from "Redux/actions";
import { notificationType } from "utils/types/user/user.types";

interface RightPanelProps {
    addNewNotification?: (notification: notificationType) => void;
}

const RightPanel: NextPage<RightPanelProps> = ({ addNewNotification }) => {
    const user = useUser();
    const dispatch = useDispatch();
    const newNotificationSubscription =
        useNewNotificationSubscriptionSubscription();

    const countUnsawNotifications = useSelector(
        (state: RootState) => state.globalReducer.countUnsawNotifications
    );

    const { setCountUnsawNotifications } = bindActionCreators(
        actionCreators,
        dispatch
    );

    const handleNewNotificationSubscription = () => {
        if (
            user?.id &&
            newNotificationSubscription?.data?.newNotificationSubscription
                ?.notification
        ) {
            const { notification } =
                newNotificationSubscription.data.newNotificationSubscription;

            console.log("new notification comming");

            if (notification.relatedUsers.find((x) => x.id === user.id)) {
                if (addNewNotification) {
                    addNewNotification(notification);
                }

                setCountUnsawNotifications(countUnsawNotifications + 1);
            }
        }
    };

    useEffect(() => {
        console.log("right panel");
        handleNewNotificationSubscription();
    }, [
        user?.id,
        newNotificationSubscription.loading,
        newNotificationSubscription.data?.newNotificationSubscription
            ?.notification?.id,
    ]);

    return <Flex flexGrow={1} flexDir="column" m={5}></Flex>;
};
export default RightPanel;
