{
  function join(array) {
    return array.join("");
  }
}

TimeRegistrationExpression
    =
    workload:Workload SPACE projectName:ProjectClause SPACE day:DateClause
        {
            return { workload: workload, projectName: projectName, day: day };
        }
    / workload:Workload SPACE projectName:ProjectClause
        {
            return { workload: workload, projectName: projectName };
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
    = "@" DateDefinition

DateDefinition
    = DayOfWeek / Date / DateOffset / DateAlias

DayOfWeek
    = "monday" / "tuesday" / "wednesday" / "thursday" / "friday" / "saturday" / "sunday"

Date
    = DIGIT DIGIT DIGIT DIGIT "/" DIGIT DIGIT "/" DIGIT DIGIT

DateOffset
    = "t" offsetSign:[+-] offset:NUMBER

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
