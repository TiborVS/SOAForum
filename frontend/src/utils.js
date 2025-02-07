function dateFromDbString(string) {
    // input format is 2025-02-04T16:12:58.908000
    const date = string.split("T")[0]
    const time = string.split("T")[1]
    const date_split = date.split("-");
    const time_split = time.split(":");
    
    const year = date_split[0];
    const month = date_split[1];
    const day = date_split[2];

    const hour = time_split[0];
    const minutes = time_split[1];
    const seconds = time_split[2].split(".")[0];
    return { year, month, day, hour, minutes, seconds }
}

export function formatDateFromDbString(string) {
    const date = dateFromDbString(string);
    return date.day + ". " + date.month + ". " + date.year + " " + date.hour + ":" + date.minutes;
}