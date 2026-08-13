package utils


var lessonStatusMap = map[string]string{
	"1": "籌備中",
	"2": "報名中",
	"3": "開課中",
	"4": "已完結",
}



func GetLessonStatus(status string) string {

	if _, ok := lessonStatusMap[status]; !ok {
		return "unknown"
	} else {
		return lessonStatusMap[status]
	}
}





