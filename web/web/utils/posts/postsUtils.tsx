import { EmotionType } from "generated/graphql";
import Emoji from "a11y-react-emoji";

export const AngryFace = <Emoji symbol="😡" label="Angry" />;
export const SunGlasses = <Emoji symbol="😎" label="Sunglasses" />;
export const SurpriseFace = <Emoji symbol="😮" label="Surprise" />;
export const ThumbsUp = <Emoji symbol="👍 " label="Thumbsup" />;
export const ThumbsDown = <Emoji symbol="👎" label="Thumbsdown" />;
export const VomitFace = <Emoji symbol="🤮" label="Vomit" />;
export const SmileFace = <Emoji symbol="😀" label="Smile" />;
export const SadFace = <Emoji symbol="😢" label="Sad" />;
export const HeartEyeFace = <Emoji symbol="😍" label="HeartEye" />;
export const HeartEmoji = <Emoji symbol="❤️" label="Heart" />;
export const FireEmoji = <Emoji symbol="🔥" label="Fire" />;
export const PreyingHands = <Emoji symbol="🙏" label="Prey" />;

export const getEmotionTypeIcon = (type: EmotionType): JSX.Element => {
    let componentType: JSX.Element | null = null;

    switch (type) {
        case EmotionType.Angry:
            componentType = AngryFace;
            break;
        case EmotionType.SunGlass:
            componentType = SunGlasses;
            break;
        case EmotionType.Surprise:
            componentType = SurpriseFace;
            break;
        case EmotionType.Thumbsdown:
            componentType = ThumbsDown;
            break;
        case EmotionType.Thumbsup:
            componentType = ThumbsUp;
            break;
        case EmotionType.Vomit:
            componentType = VomitFace;
            break;
        case EmotionType.Smile:
            componentType = SmileFace;
            break;
        case EmotionType.Sad:
            componentType = SadFace;
            break;
        case EmotionType.HeartEye:
            componentType = HeartEyeFace;
            break;
        case EmotionType.Heart:
            componentType = HeartEmoji;
            break;
        case EmotionType.Fire:
            componentType = FireEmoji;
            break;
        case EmotionType.Prey:
            componentType = PreyingHands;
            break;
        default:
            componentType = <Emoji symbol="🔥" label="Fire" />;
    }

    return componentType;
};
