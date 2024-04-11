import { Flex, Loader, Stack, createStyles } from "@mantine/core";
import type { ModWithInfo } from "~/components/mods/types";
import { Maps } from "./maps/maps";
import { ModDownloadButton } from "./modDownloadButton/modDownloadButton";
import Link from "next/link";
import { ModCarousel } from "./modCarousel";
import { COMING_SOON_PATHNAME } from "~/consts/pathnames";
import { expandedModColors } from "~/styles/expandedModColors";
import type { DifficultyColor } from "~/styles/difficultyColors";




const useStyles = createStyles(
    (theme) => ({
        map: {
            // double ampersand to increase selectivity of class to ensure it overrides any other css
            "&&": {
                /* top | left and right | bottom */
                margin: `${theme.spacing.xs} ${theme.spacing.sm} ${theme.spacing.xl}`
            },
        },
        expandedMod: {
            backgroundColor: expandedModColors.default.backgroundColor,
            color: expandedModColors.default.textColor,
            borderRadius: "0 0 50px 50px",
            // We move the expanded mod up to make
            // the mod row and expanded mod look like a single row.
            transform: "translate(0, -45px)",
            paddingTop: "10px",
        },
        moreInfo: {
            fontSize: "1rem",
        },
        modDetails: {
            width: "100%",
            /** top and bottom | left and right */
            padding: "0 20px",
        }
    }),
);




type ExpandedModProps = {
    isLoading: boolean;
    mod: ModWithInfo;
    colors: DifficultyColor;
};




const ExpandedMod = ({
    isLoading,
    mod,
    colors,
}: ExpandedModProps) => {
    const isMapperNameVisiblePermitted = false;


    const { classes } = useStyles();

    if (isLoading) return <Loader />;

    return (
        <Flex
            direction="row"
            wrap="wrap"
            align="flex-start"
            justify="space-around"
            className={classes.expandedMod}
        >
            <Maps
                isLoadingMod={isLoading}
                isNormalMod={mod.type === "Normal"}
                isMapperNameVisiblePermitted={isMapperNameVisiblePermitted}
                mapsWithTechInfo={mod.MapsWithTechInfo}
                colors={colors}
            />
            <Stack
                justify="flex-start"
                align="center"
                spacing="0"
            >
                <Flex
                    direction="row"
                    align="center"
                    justify="space-between"
                    className={classes.modDetails}
                >
                    <ModDownloadButton gamebananaModId={mod.gamebananaModId} />
                    <Link
                        href={{ pathname: COMING_SOON_PATHNAME }}
                        className={classes.moreInfo}
                    >
                        More Info
                    </Link>
                </Flex>
                <ModCarousel
                    gamebananaModId={mod.gamebananaModId}
                    numberOfMaps={mod.mapCount}
                    colors={colors}
                />
            </Stack>
        </Flex>
    );
};

export default ExpandedMod;