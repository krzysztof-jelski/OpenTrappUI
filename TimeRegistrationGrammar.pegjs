TimeRegistrationExpression
    = Workload SPACE ProjectClause SPACE DateClause / Workload SPACE ProjectClause

Workload
    = "1d"

ProjectClause
    = "#" projectName:WORD

DateClause
    = .*

SPACE
    = " "+

WORD
    = [^ ]+
