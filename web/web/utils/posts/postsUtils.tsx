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

export const getEmotionTypeIcon = (type: EmotionType): JSX.Element => {
    let componentType: JSX.Element | null = null;

    switch (type) {
        case EmotionType.Angry:
            componentType = <Emoji symbol="😡" label="Angry" />;
            break;
        case EmotionType.SunGlass:
            componentType = <Emoji symbol="😎" label="Sunglasses" />;
            break;
        case EmotionType.Surprise:
            componentType = <Emoji symbol="😮" label="Surprise" />;
            break;
        case EmotionType.Thumbsdown:
            componentType = <Emoji symbol="👎" label="Thumbsdown" />;
            break;
        case EmotionType.Thumbsup:
            componentType = <Emoji symbol="👍 " label="Thumbsup" />;
            break;
        case EmotionType.Vomit:
            componentType = <Emoji symbol="🤮" label="Vomit" />;
            break;
        case EmotionType.Smile:
            componentType = <Emoji symbol="😀" label="Smile" />;
            break;
        case EmotionType.Sad:
            componentType = <Emoji symbol="😢" label="Sad" />;
            break;
        case EmotionType.HeartEye:
            componentType = <Emoji symbol="😍" label="HearEye" />;
            break;
        case EmotionType.Heart:
            componentType = <Emoji symbol="❤️" label="Heart" />;
            break;
        case EmotionType.Fire:
            componentType = <Emoji symbol="🔥" label="Fire" />;
            break;
        case EmotionType.Prey:
            componentType = <Emoji symbol="🙏" label="Prey" />;
            break;
        default:
            componentType = <Emoji symbol="🔥" label="Fire" />;
    }

    return componentType;
};
