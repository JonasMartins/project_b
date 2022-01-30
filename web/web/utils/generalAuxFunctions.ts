export const getPastOrFutureDate = (
    countingDate: Date,
    numberOfDays: number,
    time: "past" | "future"
): Date => {
    const futureOrPastDate = new Date();

    if (time === "past") {
        futureOrPastDate.setDate(countingDate.getDate() - numberOfDays);
    } else {
        futureOrPastDate.setDate(countingDate.getDate() + numberOfDays);
    }

    return futureOrPastDate;
};

export const truncateString = (value: string, limit: number): string => {
    if (!value) {
        return "";
    }

    if (value.length > limit) {
        return value.substr(0, limit) + "...";
    } else {
        return value;
    }
};

export const compareTwoStrings = (str1: string, str2: string): boolean => {
    if (!str1 && !str2) {
        return true;
    }

    if (!str1 || !str2) {
        return false;
    }

    return (
        str1.toLocaleLowerCase().replace(/ /g, "") ===
        str2.toLocaleLowerCase().replace(/ /g, "")
    );
};

export const getMainPageFromFullPath = (path: string): string => {
    return path.split("/")[1];
};

export const getServerPathImage = (path: string | null | undefined): string => {
    // recebe o full path do disco do usuário,
    // ex /Users/jonasmartinssouza/Documents/Dev/project_a/server/images/1635646363774/doge.png
    // split no /, padrao vai ser, /images/pasta_unica/nome_arquivo.
    // pegar essas 3 informações + o endereço do server, que deve estar em um .env
    // imagem acessível: localhost:4001/images/1635646363774/doge.png
    // esse valor retornado será visível ao react

    if (!path || path === undefined) {
        return "http://127.0.0.1:4001/images/default-user-image.png";
    }

    let result = "";
    let arrPath = path.split("/");

    result = "http://127.0.0.1:4001/images";

    result += "/" + arrPath[arrPath.length - 1];

    return result;
};
