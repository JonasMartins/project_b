import { registerEnumType } from "type-graphql";

export enum EmotionType {
    SMILE = "SMILE",
    SUN_GLASS = "SUN_GLASS",
    HEART_EYE = "HEART_EYE",
    SAD = "SAD",
    VOMIT = "VOMIT",
    ANGRY = "ANGRY",
    SURPRISE = "SURPRISE",
    THUMBSUP = "THUMBSUP",
    THUMBSDOWN = "THUMBSDOWN",
    HEART = "HEART",
    FIRE = "FIRE",
    PREY = "PREY",
}
registerEnumType(EmotionType, {
    name: "EmotionType", // this one is mandatory
    description: "The basic directions", // this one is optional
});
