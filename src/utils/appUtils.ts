export class AppUtils {
  static isValidSortParam(input: string): boolean {
    const regex = /^[a-zA-Z][a-zA-Z0-9_]*:(asc|desc)$/;
    return regex.test(input);
  }
  static renderSlug(slug: string, id: number) {
    return `${slug}.${id}`;
  }
  static isValidSlug(input: string): boolean {
    const regex = /^.+\.\d+$/;
    return regex.test(input);
  }

  static formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");
    const ss = secs.toString().padStart(2, "0");

    return `${hh}:${mm}:${ss}`;
  }
}
