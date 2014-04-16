TimeRegistrationExpression
    = Workload SPACE ProjectClause SPACE DateClause / Workload SPACE ProjectClause

Workload
    = WorkloadInDays / WorkloadInHours / WorkloadInMinutes

WorkloadInDays
    = days:NUMBER "d" WorkloadInHours / days:NUMBER "d" WorkloadInMinutes / days:NUMBER "d"

WorkloadInHours 
    = hours:NUMBER "h" WorkloadInMinutes / hours:NUMBER "h"

WorkloadInMinutes 
    = minutes:NUMBER "m"

ProjectClause
    = "#" projectName:WORD

DateClause
    = .*

SPACE
    = " "+

WORD
    = [^ ]+

NUMBER
    = NON_ZERO_DIGIT DIGIT* / DIGIT

DIGIT
    = [0-9]

NON_ZERO_DIGIT
    = [1-9]
