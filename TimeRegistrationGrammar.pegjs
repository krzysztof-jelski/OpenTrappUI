TimeRegistrationExpression
    = Workload SPACE ProjectClause SPACE DateClause / Workload SPACE ProjectClause

Workload
    = WorkloadInDays / WorkloadInHours / WorkloadInMinutes

WorkloadInDays
    = days:NUMBER "d" SPACE_OPT WorkloadInHours / days:NUMBER "d" SPACE_OPT WorkloadInMinutes / days:NUMBER "d"

WorkloadInHours 
    = hours:NUMBER "h" SPACE_OPT WorkloadInMinutes / hours:NUMBER "h"

WorkloadInMinutes 
    = minutes:NUMBER "m"

ProjectClause
    = "#" projectName:WORD

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
    = [^ ]+

NUMBER
    = NON_ZERO_DIGIT DIGIT* / DIGIT

DIGIT
    = [0-9]

NON_ZERO_DIGIT
    = [1-9]
