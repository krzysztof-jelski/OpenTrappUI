{
    var dateFormat = "YYYY/MM/DD";

    function timeProvider() {
        return options.timeProvider;
    }

    function now() {
        return moment(timeProvider().getCurrentDate());
    }
}

WorkLogEntry
    =
    projectName:ProjectClause SPACE day:DateClause
        {
            return { workload: "1d", projectName: projectName, day: day };
        }
    / projectName:ProjectClause
        {
            return { workload: "1d", projectName: projectName, day: now().format(dateFormat) };
        }
    / workload:Workload SPACE projectName:ProjectClause SPACE day:DateClause
        {
            return { workload: workload, projectName: projectName, day: day };
        }
    / workload:Workload SPACE projectName:ProjectClause
        {
            return { workload: workload, projectName: projectName, day: now().format(dateFormat) };
        }

Workload
    = WorkloadInDays / WorkloadInHours / WorkloadInMinutes

WorkloadInDays
    = 
    days:Days SPACE_OPT hours:WorkloadInHours { return days + " " + hours; }
    / days:Days SPACE_OPT minutes:WorkloadInMinutes { return days + " " + minutes; }
    / Days

WorkloadInHours 
    =
    hours:Hours SPACE_OPT minutes:WorkloadInMinutes { return hours + " " + minutes; }
    / Hours

WorkloadInMinutes 
    = Minutes

Days
    = $(NUMBER "d")

Hours
    = $(NUMBER "h")

Minutes
    = $(NUMBER "m")

ProjectClause
    = "#" projectName:WORD { return projectName; }

DateClause
    = "@" date:DateDefinition { return date; }

DateDefinition
    =
    dayOfWeek:DayOfWeek
        {
            var dayOfWeekDate = now().day(dayOfWeek);
            if (dayOfWeekDate.isAfter(now())) {
                dayOfWeekDate.subtract('days', 7);
            }
            return dayOfWeekDate.format(dateFormat);
        }
    / date:Date
        {
            if (moment(date, dateFormat).isValid()) {
                return moment(date, dateFormat).format(dateFormat);
            } else {
                error("Not a valid date");
            }
        }
    / relativeDay:RelativeDay
        {
            relativeDay = relativeDay.toLowerCase();
            var relativeDayDate = now();
            if (relativeDay === "yesterday") {
                relativeDayDate.subtract('days', 1);
            } else if (relativeDay === "tomorrow") {
                relativeDayDate.add('days', 1);
            }
            return relativeDayDate.format(dateFormat);
        }
    / DateOffset

DayOfWeek
    = $([Mm] "onday" / [Tt] "uesday" / [Ww] "ednesday" / [Tt] "hursday" / [Ff] "riday" / [Ss] "aturday" / [Ss] "unday")

Date
    = $(Year "/" Month "/" Day)

Year
    = NON_ZERO_DIGIT DIGIT DIGIT DIGIT

Month
    = [01] DIGIT / NON_ZERO_DIGIT

Day
    = [0-3] DIGIT / NON_ZERO_DIGIT

RelativeDay
    = $([Yy] "esterday" / [Tt] "oday" / [Tt] "omorrow")

DateOffset
    = "t" offsetSign:[+-] offset:NUMBER
        {
            var daysToAdd = offsetSign + offset;
            return now().add('days', daysToAdd).format(dateFormat)
        }

SPACE
    = " "+

SPACE_OPT
    = " "*

WORD
    = $([^ ]+)

NUMBER
    = $(NON_ZERO_DIGIT DIGIT*) / DIGIT

DIGIT
    = [0-9]

NON_ZERO_DIGIT
    = [1-9]
