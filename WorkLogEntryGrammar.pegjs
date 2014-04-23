{
    var dateFormat = "YYYY/MM/DD";

    function join(array) {
        return array.join("");
    }

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
    = days:NUMBER "d" { return days + "d"; }

Hours
    = hours:NUMBER "h" { return hours + "h"; }

Minutes
    = minutes:NUMBER "m" { return minutes + "m"; }

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
            if (moment(date).isValid()) {
                return moment(date).format(dateFormat);
            } else {
                error("Not a valid date");
            }
        }
    / DateOffset
    / DateAlias

DayOfWeek
    = "monday" / "tuesday" / "wednesday" / "thursday" / "friday" / "saturday" / "sunday"

Date
    = DIGIT DIGIT DIGIT DIGIT "/" DIGIT DIGIT "/" DIGIT DIGIT

DateOffset
    = "t" offsetSign:[+-] offset:NUMBER
        {
            var daysToAdd = offsetSign + offset;
            return now().add('days', daysToAdd).format(dateFormat)
        }

DateAlias
    = "today" / "yesterday" / "tomorrow"

SPACE
    = " "+

SPACE_OPT
    = " "*

WORD
    = word:[^ ]+ { return join(word); }

NUMBER
    = first:NON_ZERO_DIGIT rest:DIGIT* { return first + join(rest); } / DIGIT

DIGIT
    = [0-9]

NON_ZERO_DIGIT
    = [1-9]
