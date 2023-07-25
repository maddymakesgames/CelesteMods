import { api } from "~/utils/api";
import { Text, Loader, Group } from "@mantine/core";




type PublisherNameProps = {
    publisherId: number;
};




const PUBLISHER_NAME_LABEL = "Publisher: ";




const PublisherName = ({ publisherId }: PublisherNameProps) => {
    const publisherQuery = api.publisher.getById.useQuery({ id: publisherId }, { queryKey: ["publisher.getById", { id: publisherId }] });

    const publisher = publisherQuery.data;


    const publisherName = publisher?.name ?? (
        publisher === undefined ?
        "Publisher not loaded" :
            "Name undefined"
    );


    if (publisherQuery.isLoading) return (
        <Group position="center">
            <Text>
                {PUBLISHER_NAME_LABEL}
            </Text>
            <Loader 
                size="sm"
            />
        </Group>
    );


    return (
        <Text>
            {PUBLISHER_NAME_LABEL + publisherName}
        </Text>
    );
};


export default PublisherName;