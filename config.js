// API Base URL (Laragon környezethez)
const API_BASE = '/gemini-music-app';

// PocketBase konfiguráció
const POCKETBASE_URL = 'http://192.168.1.122:8090';
const pb = new PocketBase(POCKETBASE_URL);

// Collection név
const LYRICS_COLLECTION = 'lyrics';

// PocketBase helper függvények
const PB = {
    // Összes mentett dalszöveg lekérése
    async getAllLyrics() {
        try {
            const records = await pb.collection(LYRICS_COLLECTION).getFullList({
                sort: '-created',
            });
            return records;
        } catch (error) {
            console.error('Error fetching lyrics:', error);
            return [];
        }
    },

    // Új dalszöveg mentése
    async saveLyric(title, lyrics) {
        try {
            const record = await pb.collection(LYRICS_COLLECTION).create({
                title: title,
                lyrics: lyrics
            });
            return record;
        } catch (error) {
            console.error('Error saving lyric:', error);
            throw error;
        }
    },

    // Dalszöveg törlése
    async deleteLyric(id) {
        try {
            await pb.collection(LYRICS_COLLECTION).delete(id);
            return true;
        } catch (error) {
            console.error('Error deleting lyric:', error);
            throw error;
        }
    },

    // Összes dalszöveg törlése
    async deleteAllLyrics() {
        try {
            const records = await this.getAllLyrics();
            for (const record of records) {
                await this.deleteLyric(record.id);
            }
            return true;
        } catch (error) {
            console.error('Error deleting all lyrics:', error);
            throw error;
        }
    },

    // Realtime változások figyelése
    subscribeToChanges(callback) {
        pb.collection(LYRICS_COLLECTION).subscribe('*', function (e) {
            console.log('PocketBase change:', e.action);
            callback(e);
        });
    },

    // Leiratkozás a változásokról
    unsubscribe() {
        pb.collection(LYRICS_COLLECTION).unsubscribe('*');
    }
};
