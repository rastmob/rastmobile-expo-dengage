/*
 * rastmobile-expo-dengage
 * created by: Rastmobile Team
 */
export class RastmobileDengageLog {
  static log(str: string) {
    console.log(`\trastmobile-expo-dengage: ${str}`)
  }

  static error(str: string) {
    console.error(`\trastmobile-expo-dengage: ${str}`)
  }
}
