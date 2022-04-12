type AccountInstanceURI = string;
type AssetInstanceURI = string;
type NoteInstanceURI = string;
type InstanceURI = string;
type ProfilesURI = string;
type LinksURI = string;
type BacklinksURI = string;
type AssetsURI = string;
type NotesURI = string;

type URI = string;

type Network = string;
type LinkType = string;
type ProfileSource = string;
type LinkSource = string;
type AssetSource = string;
type NoteSource = string;

type ResponseBase<URIType, ElementType> = {
    version: 'v0.4.0';
    date_updated: string;

    identifier: URIType;
    identifier_next?: URIType;

    total: number;
    list?: ElementType[];
};

type InstanceResponse = ResponseBase<
    InstanceURI,
    {
        type: 'profiles' | 'links' | 'backlinks' | 'assets' | 'notes';
        identifier: ProfilesURI | LinksURI | BacklinksURI | AssetsURI | NotesURI;
    }
>;

type Profile = {
    name?: string;
    avatars?: URI[];
    bio?: string;
    attachments?: {
        type?: string;
        content?: string;
        address?: URI;
        mime_type: string;
        size_in_bytes?: number;
    }[];

    connected_accounts?: AccountInstanceURI[];

    source: ProfileSource;

    metadata?: {
        network: Network;
        proof: string;

        [key: string]: any;
    };
};

type ProfilesResponse = ResponseBase<ProfilesURI, Profile>;

type Link = {
    from: InstanceURI;
    to: InstanceURI;
    type: LinkType;

    source: LinkSource;

    metadata?: {
        network: Network;
        proof: string;

        [key: string]: any;
    };
};

type LinksResponse = ResponseBase<LinksURI, Link>;

type Item = {
    identifier: AssetInstanceURI | NoteInstanceURI;
    date_created: string;
    date_updated: string;

    related_urls?: string[];

    links: LinksURI;
    backlinks: BacklinksURI;

    tags?: string[];
    authors: AccountInstanceURI[];
    title?: string;
    summary?: string;
    attachments?: {
        type?: string;
        content?: string;
        address?: URI;
        mime_type: string;
        size_in_bytes?: number;
    }[];

    source: AssetSource | NoteSource;

    metadata?: {
        network: Network;
        proof: string;

        [key: string]: any;
    };
};

type ItemsResponse = ResponseBase<AssetsURI | NotesURI, Item>;
