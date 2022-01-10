import { EmotionType } from "generated/graphql";
import Emoji from "a11y-react-emoji";
import { emotion as emotionElement } from "utils/types/post/post.types";
import { Button } from "@chakra-ui/react";

interface EmotionTypesObj {
    [key: string]: number;
}

export const getEmotionListCount = (
    list: emotionElement[] | undefined | null
): JSX.Element => {
    if (!list) {
        return <></>;
    }
    let uniqueEmotions: emotionElement[] = [];
    let singleEmotions: EmotionType[] = [];
    let componentType: JSX.Element | null = null;
    let emotionsCount: EmotionTypesObj = {
        ANGRY: 0,
        SUN_GLASS: 0,
        SURPRISE: 0,
        THUMBSDOWN: 0,
        THUMBSUP: 0,
        VOMIT: 0,
        SMILE: 0,
        SAD: 0,
        HEART_EYE: 0,
        HEART: 0,
        FIRE: 0,
        PREY: 0,
    };
    list.forEach((item) => {
        emotionsCount[item.type] = emotionsCount[item.type] + 1;
    });

    list.map((item) => {
        if (!singleEmotions.includes(item.type)) {
            uniqueEmotions.push(item);
            singleEmotions.push(item.type);
        }
    });

    componentType = (
        <>
            {uniqueEmotions.map((item) => (
                <Button
                    leftIcon={getEmotionTypeIcon(item.type)}
                    variant="outline"
                    size="sm"
                    borderRadius="1em"
                >
                    {emotionsCount[item.type]}
                </Button>
            ))}
        </>
    );

    return componentType;
};

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
