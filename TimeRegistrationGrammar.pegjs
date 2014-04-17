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
    = days:NUMBER "d" SPACE_OPT WorkloadInHours / days:NUMBER "d" SPACE_OPT WorkloadInMinutes / days:NUMBER "d"

WorkloadInHours 
    = hours:NUMBER "h" SPACE_OPT WorkloadInMinutes / hours:NUMBER "h"

WorkloadInMinutes 
    = minutes:NUMBER "m"

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
