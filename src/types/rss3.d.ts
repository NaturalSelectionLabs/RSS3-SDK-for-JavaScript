type IRSS3ID = string;
type IRSS3ItemID = string;
type IRSS3ItemsID = string;
type IRSS3ListID = string;
type ThirdPartyAddress = string[];

type IRSS3Content = IRSS3 | IRSS3Items | IRSS3List;

// Common attributes for each files
interface IRSS3Base {
    id: IRSS3ID | IRSS3ItemsID | IRSS3ListID;
    '@version': 'rss3.io/version/v0.1.0';
    date_created: string;
    date_updated: string;
    signature?: string;
}

// Entrance, IRSS3 file
interface IRSS3 extends IRSS3Base {
    id: IRSS3ID;

    profile?: IRSS3Profile;

    items?: IRSS3Item[];
    items_next?: IRSS3ItemsID;

    links?: {
        type: string;
        tags?: string[];
        list: IRSS3ID[];
        list_next?: IRSS3ListID;
        signature?: string;
    }[];
    '@backlinks'?: {
        type: string;
        list: IRSS3ID[];
        list_next?: IRSS3ListID;
    }[];

    assets?: {
        type: string;
        tags?: string[];
        content: string;
    }[];
}

// IRSS3Items file
interface IRSS3Items extends IRSS3Base {
    id: IRSS3ItemsID;

    items: IRSS3Item[];
    items_next?: IRSS3ItemsID;
}

// IRSS3List file
interface IRSS3List extends IRSS3Base {
    id: IRSS3ListID;

    list: IRSS3ID[] | IRSS3ItemID[];
    list_next?: IRSS3ListID;
}

interface IRSS3Item {
    id: IRSS3ItemID;
    authors?: IRSS3ID[];
    title?: string;
    summary?: string;
    tags?: string[];
    date_published?: string;
    date_modified?: string;

    type?: string;
    upstream?: IRSS3ItemID;

    contents?: {
        address: ThirdPartyAddress;
        mime_type: string;
        name?: string;
        tags?: string[];
        size_in_bytes?: string;
        duration_in_seconds?: string;
    }[];

    '@contexts'?: {
        type?: string;
        list: IRSS3ItemID[];
        list_next?: IRSS3ListID;
    }[];

    signature?: string;
}

interface IRSS3Profile {
    name?: string;
    avatar?: ThirdPartyAddress;
    bio?: string;
    tags?: string[];
    signature?: string;
}
