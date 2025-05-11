export enum CourseStatus {
        NotStarted = 'not-started',
        Ended = 'ended',
        Ready = 'ready'
}

export function getCourseStatus(courseTimeIndices: number[]): CourseStatus {
        const now = new Date()
        const totalMinutes = now.getHours() * 60 + now.getMinutes()

        const courseStart = Math.min(...courseTimeIndices.map(i => 5 * 60 + i * 30))
        const courseEnd = Math.max(...courseTimeIndices.map(i => 5 * 60 + (i + 1) * 30))

        if (totalMinutes < courseStart - 10) return CourseStatus.NotStarted
        else if (totalMinutes >= courseEnd) return CourseStatus.Ended
        else return CourseStatus.Ready
}
