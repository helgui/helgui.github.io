const MARKET_ABI = [{"inputs":[{"internalType":"uint256","name":"page","type":"uint256"},{"internalType":"uint256","name":"limit","type":"uint256"}],"name":"fetchMarketListings","outputs":[{"components":[{"internalType":"uint256","name":"listingId","type":"uint256"},{"internalType":"address","name":"nftContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address payable","name":"seller","type":"address"},{"internalType":"address payable","name":"owner","type":"address"},{"internalType":"uint256","name":"price","type":"uint256"}],"internalType":"struct NFTMarket.MarketListing[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"}];
const NFT_ABI  = [{"inputs":[{"internalType":"uint256","name":"nftId","type":"uint256"}],"name":"getNftData","outputs":[{"components":[{"internalType":"uint256","name":"gameId","type":"uint256"},{"internalType":"uint256","name":"exp","type":"uint256"},{"internalType":"uint256","name":"exta","type":"uint256"},{"internalType":"uint256","name":"extb","type":"uint256"},{"internalType":"uint256","name":"extc","type":"uint256"}],"internalType":"struct CrusaderNFT.CrusaderNFTData","name":"","type":"tuple"}],"stateMutability":"view","type":"function"}];
const MARKET_ADDRESS = "0x66DCFD53B75a97AD458ce1A565f45D51724e02eF";
const NFT_ADDRESS = "0xD209cD6a8C64C1C8748a391c40cD2eAEbC86B2EF";
const NAME_OF = {"13": "MissingCode", "14": "MissingCode - First Clear", "25": "Lucky Ring of Nat20s", "26": "Flesh Golem", "27": "Venomous Scorpion", "28": "Golem - Mossen", "29": "Crusader Shield", "30": "Blood Blade", "31": "Empowering Necklace", "32": "Weakening Wand", "33": "Risky Hammer", "34": "Weakening Sentry", "35": "Air Elemental", "36": "Klackon - Bloodstained", "37": "Little Ghost", "38": "Giant Blade", "39": "Shinobi Ring", "40": "Lava Armor", "41": "Rage Gauntlet", "42": "Guard Armor", "43": "Brawler Ring", "44": "Guardian Pendant", "45": "Cursed Axe", "46": "Siphon Blade", "47": "Crusader Helm", "48": "Leyline Boots", "49": "Circuit Breaker", "50": "Shepherd's Robes", "51": "Nature's Blessing", "52": "Snow Elemental", "53": "Ice Pool", "54": "Cold One", "55": "Crusanta", "56": "Molten Hammer", "1000": "Flame Scroll", "1001": "Ankh", "1002": "Draining Pipes", "7000": "Shieldy", "7001": "Dogey", "7002": "Squirrel of Truth", "7003": "Sporey", "7005": "Ribby", "7006": "Spooky", "7007": "Jelly", "7008": "Ratatouille", "10001": "Tower Crystal", "10002": "Slime Minter", "10003": "Bag of Holders", "10004": "Turkey Leg", "10005": "Candy Cane", "10008": "Hype Ring"};

var w3 = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org");
var market = new ethers.Contract(MARKET_ADDRESS, MARKET_ABI, w3);
var nft = new ethers.Contract(NFT_ADDRESS, NFT_ABI, w3);

var listings = [];
var curIdx = 0;
var table = document.getElementById("listings-table")
var button = document.getElementById("load-btn")

async function fetchListings() {
    while (true) {
        try {
            listings = (await market.fetchMarketListings(0, 600)).slice().sort((a, b) => a[5] - b[5]);
            break;
        } catch(e) {
        }
    }
}

async function loadMore(nItems) {
    button.disabled = true;
    button.innerHTML = "<i class=\"fa fa-refresh fa-spin\"></i>Loading...";
    if (listings.length == 0) {
        await fetchListings();
    }
    let n = Math.min(listings.length, curIdx + nItems); 
    let promises = [];
    for (let i = curIdx; i < n; ++i) {
        promises.push(nft.getNftData(listings[i][2]));
    }
    for (let i = curIdx; i < n; ++i) {
        let data = await promises[i - curIdx];
        let row = table.insertRow();
        row.insertCell().innerHTML = NAME_OF[data[0].toString()];
        row.insertCell().innerHTML = listings[i][2].toString(),
        row.insertCell().innerHTML = data[1].toString();
        row.insertCell().innerHTML = ethers.utils.formatEther(listings[i][5]);
    }
    curIdx = n;
    button.innerHTML = button.innerHTML = "<i class=\"fa fa-refresh\"></i>Load more";
    button.disabled = false;
}

loadMore(15);
