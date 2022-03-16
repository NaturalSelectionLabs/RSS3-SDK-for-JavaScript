// Instance
type AccountInstance = string;
type ItemInstance = string;

type Instance = AccountInstance | ItemInstance;

// URI
type InstanceURI = string;

type CustomItemListURI = string;
type AggregatedItemListURI = string;

type CustomLinkListURI = string;
type AggregatedLinkListURI = string;
type BacklinkListURI = string;

type URI = string;

// Common attributes for each files
interface Base {
    version: 'v0.4.0';
    identifier:
        | InstanceURI
        | CustomItemListURI
        | AggregatedItemListURI
        | CustomLinkListURI
        | AggregatedLinkListURI
        | BacklinkListURI;
    date_created: string;
    date_updated: string;
}

interface SignedBase extends Base {
    signature: string;
    agents?: {
        pubkey: string;
        signature: string;
        authorization: string;
        app: string;
        date_expired: string;
    }[];
    controller?: string;
}

interface UnsignedBase extends Base {
    auto: true;
}

// Base types
interface Attachment {
    type?: string;
    content?: string;
    address?: URI;
    mime_type: string;
    size_in_bytes?: number;
}

interface Metadata {
    network?: string;
    proof: string;

    [key: string]: any;
}

interface Filters {
    blocklist?: string[];
    allowlist?: string[];
}

interface LinksSet {
    identifiers?: {
        type: string;
        identifier_custom: CustomLinkListURI;
        identifier: AggregatedLinkListURI;
    }[];
    identifier_back: BacklinkListURI;
}

// RSS3 index files, main entrance for a instance
interface Index extends SignedBase, UnsignedBase {
    identifier: InstanceURI;

    profile?: {
        name?: string;
        avatars?: URI[];
        bio?: string;
        attachments?: Attachment[];

        accounts?: {
            identifier: InstanceURI;
            signature?: string;
        }[];

        tags?: string[];
        metadata?: Metadata;
    };

    links: LinksSet;

    items: {
        notes: {
            identifier_custom?: CustomItemListURI;
            identifier: AggregatedItemListURI;
            filters?: Filters;
        };
        assets: {
            identifier_custom?: CustomItemListURI;
            identifier: AggregatedItemListURI;
            filters?: Filters;
        };
    };
}

// items
type Item = {
    identifier: string;
    date_created: string;
    date_updated: string;

    auto?: true;
    related_urls?: string[];

    links: LinksSet;

    tags?: string[];
    authors: string[];
    title?: string;
    summary?: string;
    attachments?: Attachment[];

    metadata?: Metadata;
};

type Link = {
    identifier_target: InstanceURI;
    type: string;

    auto?: true;
    metadata?: Metadata;
};

// RSS3 list files
type ListBase<URIType, ElementType> = {
    identifier: URIType;
    identifier_next?: URIType;

    total: number;
    list?: ElementType[];
};

type CustomItemList = SignedBase & ListBase<CustomItemListURI, Item>;
type AggregatedItemList = UnsignedBase & ListBase<AggregatedItemListURI, Item>;

type CustomLinkList = (SignedBase | UnsignedBase) & ListBase<CustomLinkListURI, Link>;
type AggregatedLinkList = UnsignedBase & ListBase<AggregatedLinkListURI, Link>;
type BacklinkList = UnsignedBase & ListBase<BacklinkListURI, Link>;
