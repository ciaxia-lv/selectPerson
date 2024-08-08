export const defaultsPic =
    'https://oss-appupload.icomecloud.com/userInfo/faceUrl/prod/d3c26f22f46c9ae4037562494b111ba0.png-m_app_avatar.jpg'
export function getActualWidthOfChars(text: string, options: any = {}) {
    const {
        size = 14,
        family = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,\n" +
            "    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
    } = options
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
        return 0
    }
    ctx.font = `${size}px ${family}`
    const metrics = ctx.measureText(text)
    const actual = Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight)
    return Math.max(metrics.width, actual)
}
// 代办
export function arrToMap(arr: any, arrKey: string, key: string) {
    return function () {
        const map = new Map()
        if (!Array.isArray(arr?.value?.[arrKey] || arr[arrKey])) {
            return map
        }
        ;(arr?.value || arr)?.[arrKey]?.forEach((item: any, index: number) => {
            map.set(item[key], { ...item, __index: index })
        })
        return map
    }
}