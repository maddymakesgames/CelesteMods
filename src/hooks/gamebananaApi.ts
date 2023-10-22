import { useEffect, useMemo, useState } from "react";
import { useFetch } from "~/hooks/useFetch";




const GAMEBANANA_API_BASE_URL = "api.gamebanana.com/Core/Item/Data" as const;

const GAMEBANANA_API_ERROR_STRING = "GameBanana API not responding as expected." as const;




export type GamebananaApiResponse<
    ReturnKeys extends boolean,
    Key extends string = (
        ReturnKeys extends true ?
        string :
        never
    ),
> = (
        ReturnKeys extends true ?
        Record<Key, string> :
        string[]
    );




const GAMEBANANA_ITEM_TYPES = ["Mod"] as const;

export type GamebananaItemType = typeof GAMEBANANA_ITEM_TYPES[number];


const GAMEBANANA_MOD_FIELDS = [
    "date",
    "screenshots",
] as const;

const GAMEBANANA_ITEM_FIELDS: {
    [ItemType in GamebananaItemType]: readonly string[];
} = {
    Mod: GAMEBANANA_MOD_FIELDS,
};

type GamebananaItemFields<      //TODO!!!: make this work then continue below
    ItemType extends GamebananaItemType
> = typeof GAMEBANANA_ITEM_FIELDS[ItemType];

export const getGamebananaItemFields = <
    ItemType extends GamebananaItemType,
    Fields extends GamebananaItemFields<ItemType>,
>(
    itemType: ItemType,
    fields: Fields,
) => {
    //TODO!!: continue here after above is fixed
};


type GetGamebananaApiUrlProps<
    ReturnType extends boolean,
> = {
    itemType: GamebananaItemType;
    itemId: number | undefined;
    fields: string | string[];
    returnKeys?: ReturnType;
};


export const useGamebananaApiUrl = <
    ReturnType extends boolean
>(
    {
        itemType,
        itemId,
        fields,
        returnKeys = false as ReturnType,
    }: GetGamebananaApiUrlProps<ReturnType>,
) => {
    //get fieldsString
    const [fieldsString, setFieldsString] = useState<string>("");

    useEffect(() => {
        if (typeof fields === "string") setFieldsString(fields);
        else setFieldsString(fields.join(","));
    }, [fields]);


    //get query url
    const [queryUrl, setQueryUrl] = useState<string>("");

    useEffect(() => {
        const url = itemId === undefined ?
            "" :
            `https://${GAMEBANANA_API_BASE_URL}?itemtype=${itemType}&itemid=${itemId}&fields=${fieldsString}${returnKeys ? "&return_keys=true" : ""}`;

        setQueryUrl(url);
    }, [itemType, itemId, fieldsString, returnKeys]);


    return { queryUrl };
};




type GamebananaScreenshotData = {
    _nFilesize: number;
    _sCaption: string;
    _sFile: string;
    _sFile100: string;
    _sFile220?: string;
    _sFile530?: string;
    _sFile800?: string;
    _sTicketId: string;
};


const isGamebananaScreenshotData = (
    data: unknown
): data is GamebananaScreenshotData => {   //tried to create as assertion, but encountered weird ts error
    if (typeof data !== "object" || data === null) return false;

    const dataObject = data as Record<string, unknown>;


    if (
        typeof dataObject._nFilesize === "number" &&
        typeof dataObject._sCaption === "string" &&
        typeof dataObject._sFile === "string" &&
        typeof dataObject._sFile100 === "string" &&
        (!dataObject._sFile220 || typeof dataObject._sFile220 === "string") &&
        (!dataObject._sFile530 || typeof dataObject._sFile530 === "string") &&
        (!dataObject._sFile800 || typeof dataObject._sFile800 === "string") &&
        typeof dataObject._sTicketId === "string"
    ) return false;


    return true;
};


const isGamebananaScreenshotDataArray = (data: unknown): data is GamebananaScreenshotData[] => {
    if (!Array.isArray(data)) return false;

    return data.every(isGamebananaScreenshotData);
};




type UseGamebananaModImageUrlsProps = {
    gamebananaModId: number | undefined;
};

type UseGamebananaModImageUrlsReturn = {
    imageUrls?: string[];
};


const GAMEBANANA_MOD_IMAGES_BASE_URL = "https://images.gamebanana.com/img/ss/mods/";

export const useGamebananaModImageUrls = (
    { gamebananaModId }: UseGamebananaModImageUrlsProps
): UseGamebananaModImageUrlsReturn => {
    //get query url
    const [gamebananaApiUrlProps, setGamebananaApiUrlProps] = useState<GetGamebananaApiUrlProps<boolean>>({
        itemType: "Mod",
        itemId: gamebananaModId,
        fields: "screenshots",
        returnKeys: true,
    });

    useEffect(() => {
        setGamebananaApiUrlProps({
            itemType: "Mod",
            itemId: gamebananaModId,
            fields: "screenshots",
            returnKeys: true,
        });
    }, [gamebananaModId]);

    const { queryUrl } = useGamebananaApiUrl(gamebananaApiUrlProps);


    const { data, isLoading, error } = useFetch<GamebananaApiResponse<true, "screenshots">>(queryUrl);    //TODO!: implement caching    //TODO!!!: continue here. queryUrl is being populated, but screenshotData is empty. it seems like useFetch (or useEffect) isn't re-running when queryUrl changes

    //get screenshotData
    const screenshotData = useMemo(() => {
        if (isLoading) return [];

        const dataJSON = data?.screenshots;

        if (dataJSON) {
            const data: unknown = JSON.parse(dataJSON);

            if (!isGamebananaScreenshotDataArray(data)) throw new Error(GAMEBANANA_API_ERROR_STRING);

            console.log(`screenshotData: ${JSON.stringify(data)}`);

            return data;
        }
        else {
            console.log(`screenshotDataQuery.data: ${JSON.stringify(data)}`);
            return [];
        }
    }, [data, isLoading]);


    //get image urls
    const imageUrls = useMemo(() => {
        console.log(`screenshotData: ${JSON.stringify(screenshotData)}`);

        return screenshotData.map(
            ({ _sFile }) => `${GAMEBANANA_MOD_IMAGES_BASE_URL}${_sFile}`,
        );
    }, [screenshotData]);


    if (error) console.error(error);

    if (isLoading) return {};

    return { imageUrls };
};




export const GAMEBANANA_OLYMPUS_ICON_URL = "https://images.gamebanana.com/img/ico/tools/60b506516b5dc.png";


type UseGamebananaModDownloadUrlProps = {
    gamebananaModId: number | undefined;
};

type UseGamebananaModDownloadUrlReturn = {
    downloadUrl?: string;
};


const GAMEBANANA_MOD_DOWNLOAD_BASE_URL = ``;

export const useGamebananaModDownloadUrl = (
    { gamebananaModId }: UseGamebananaModDownloadUrlProps
): UseGamebananaModDownloadUrlReturn => {
    //TODO!: implement this

    return {
        downloadUrl: "",
    };
};