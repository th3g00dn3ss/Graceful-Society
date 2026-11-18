// Discord Developer Portal > uygulaman > OAuth2 > Client ID
// Boş bırakırsan Discord girişi görünmez, profil sayfası yine çalışır.
const DISCORD_CLIENT_ID = '1572561960342650961';

const USER_KEY = 'gs-user';
const PLAYER_KEY = 'gs-player';
const STATE_KEY = 'gs-oauth-state';

export const discordEnabled = !!DISCORD_CLIENT_ID;

export function getUser() {
    try {
        const raw = localStorage.getItem(USER_KEY);
        const user = raw ? JSON.parse(raw) : null;
        return user && user.id ? user : null;
    } catch (e) {
        return null;
    }
}

export function avatarUrl(user) {
    if (!user) return '';
    if (user.avatar) {
        return 'https://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.png?size=64';
    }
    let index = 0;
    try {
        index = Number((BigInt(user.id) >> 22n) % 6n);
    } catch (e) {
        index = 0;
    }
    return 'https://cdn.discordapp.com/embed/avatars/' + index + '.png';
}

export function login() {
    if (!DISCORD_CLIENT_ID) return;
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    const state = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    sessionStorage.setItem(STATE_KEY, state);

    const redirect = new URL('auth.html', location.href.split('#')[0]).href;
    location.href =
        'https://discord.com/oauth2/authorize?response_type=token' +
        '&client_id=' + encodeURIComponent(DISCORD_CLIENT_ID) +
        '&scope=identify' +
        '&state=' + state +
        '&redirect_uri=' + encodeURIComponent(redirect);
}

export function logout() {
    try {
        localStorage.removeItem(USER_KEY);
    } catch (e) {
        // önemli değil
    }
}

export function getPlayer() {
    try {
        return localStorage.getItem(PLAYER_KEY) || '';
    } catch (e) {
        return '';
    }
}

export function setPlayer(name) {
    try {
        localStorage.setItem(PLAYER_KEY, name);
    } catch (e) {
        // önemli değil
    }
}

export function clearPlayer() {
    try {
        localStorage.removeItem(PLAYER_KEY);
    } catch (e) {
        // önemli değil
    }
}
