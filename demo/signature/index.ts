import { UtilsSignature } from './utils/signature';
import { ethers } from 'ethers';

const obj: any = {
    version: 'v0.4.0',
    date_created: '2021-08-17T14:36:00.676Z',
    date_updated: '2022-02-10T22:50:53.132Z',

    signature:
        '0x85d66b17df7343364c6b89ede6ff15279505abfdfa7b8c70590d53a3a10db97a504b8a2536a7dcc12527af42f28f643a258d48f395b8fa5917336f06d8972be41c',
    agents: [
        {
            pubkey: 'rrqJ2xn7oUd4wGW8VbsZk9XeacYMap4/jprIA5b35ns=',
            signature: 'PObUwUA+BEStJZJoY4xBsOkQujsRAZ4yULZIu0orDHCID2ezI5/eD8EskIK+RFNvSCp9tKTSYqurEFa2egW6Dg==',
            authorization: '',
            app: 'Revery',
            date_expired: '2023-02-10T22:50:53.132Z',
        },
    ],

    profile: {
        name: 'DIYgod',
        avatars: ['ipfs://QmT1zZNHvXxdTzHesfEdvFjMPvw536Ltbup7B4ijGVib7t'],
        bio: 'Cofounder of RSS3.',
        attachments: [
            {
                type: 'websites',
                content: 'https://rss3.io\nhttps://diygod.me',
                mime_type: 'text/uri-list',
            },
            {
                type: 'banner',
                content: 'ipfs://QmT1zZNHvXxdTzHesfEdvFjMPvw536Ltbup7B4ijGVib7t',
                mime_type: 'image/jpeg',
            },
        ],

        accounts: [
            {
                identifier: 'rss3://account:0x8768515270aA67C624d3EA3B98CA464672C50183@ethereum',
                signature:
                    '0x4828da56a162b9504dca6009864a90ed0ca3e56256d8458af451874ad7dd9cb26be4f399a56a8b69a881297ba6b6434a7f2f4a4f3557890d1efa8490769187be1b',
            },
            {
                identifier: 'rss3://account:DIYgod@twitter',
            },
        ],
    },

    links: {
        identifiers: [
            {
                type: 'following',
                identifier_custom:
                    'rss3://account:0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944@ethereum/list/link/following/1',
                identifier: 'rss3://account:0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944@ethereum/list/link/following',
            },
        ],
        identifier_back: 'rss3://account:0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944@ethereum/list/backlink',
    },

    items: {
        notes: {
            identifier_custom: 'rss3://account:0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944@ethereum/list/note/0',
            identifier: 'rss3://account:0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944@ethereum/list/note',
            filters: {
                blocklist: ['Twitter'],
            },
        },
        assets: {
            identifier_custom: 'rss3://account:0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944@ethereum/list/asset/0',
            identifier: 'rss3://account:0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944@ethereum/list/asset',
            filters: {
                allowlist: ['Polygon'],
            },
        },
    },
};

const signer = ethers.Wallet.createRandom();
obj.identifier = `rss3://account:${signer.address}@ethereum`;

const agentMessage = UtilsSignature.getMessage(obj);

(async () => {
    obj.signature = await signer.signMessage(agentMessage);
    console.log(agentMessage);
    console.log('-------------------------------------');
    console.log(obj);
    console.log('-------------------------------------');
    console.log(JSON.stringify(obj));
})();
