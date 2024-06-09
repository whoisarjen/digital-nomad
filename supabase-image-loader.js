export default function supabaseLoader({ src, width = 600, quality = 75 }) {
    return `https://qqculblfttltvxvquukx.supabase.co/storage/v1/object/public/images${src}?width=${width}&quality=${quality}`
}
