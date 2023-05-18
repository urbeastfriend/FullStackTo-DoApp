export function formatDate(dateString: string): string{
    return new Date(dateString).toLocaleString("ru-RU",
    {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    });
}