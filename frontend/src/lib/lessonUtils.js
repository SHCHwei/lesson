/**
 * 課程狀態工具函數
 */

// 課程狀態對照表
const LESSON_STATUS_MAP = {
  '1': '籌備中',
  '2': '報名中',
  '3': '開課中',
  '4': '已完結',
}

/**
 * 將課程狀態代號轉換為中文
 * @param {string} statusCode - 狀態代號 ("1", "2", "3", "4")
 * @returns {string} 中文狀態文字
 */
export const getLessonStatusText = (statusCode) => {
  return LESSON_STATUS_MAP[statusCode] || '未知'
}

/**
 * 根據課程狀態代號取得對應的顏色
 * @param {string} statusCode - 狀態代號
 * @returns {string} MUI Chip 的 color 屬性值
 */
export const getLessonStatusColor = (statusCode) => {
  switch (statusCode) {
    case '1': // 籌備中
      return 'default'
    case '2': // 報名中
      return 'info'
    case '3': // 開課中
      return 'success'
    case '4': // 已完結
      return 'warning'
    default:
      return 'default'
  }
}
