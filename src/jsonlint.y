
/* 
  ECMA-262 5th Edition, 15.12.1 The JSON Grammar.
  Modified to forbid top level primitives.
*/


/* author: Zach Carter */


%start JSONText

%%

JSONString
    : STRING
        {$$ = yytext;}
    ;

JSONNumber
    : NUMBER
        {$$ = Number(yytext);}
    ;

JSONNullLiteral
    : NULL
        {$$ = null;}
    ;

JSONBooleanLiteral
    : TRUE
        {$$ = true;}
    | FALSE
        {$$ = false;}
    ;

JSONText
    : JSONObject EOF
        {return $$ = $1;}
    | JSONArray EOF
        {return $$ = $1;}
    ;

JSONValue
    : JSONNullLiteral
        {$$ = $1;}
    | JSONBooleanLiteral
        {$$ = $1;}
    | JSONString
        {$$ = $1;}
    | JSONNumber
        {$$ = $1;}
    | JSONObject
        {$$ = $1;}
    | JSONArray
        {$$ = $1;}
    ;

JSONObject
    : '{' '}'
        {{$$ = {};}}
    | '{' JSONMemberList '}'
        {$$ = $2;}
    ;

JSONMember
    : JSONString ':' JSONValue
        {$$ = [$1, $3];}
    ;

JSONMemberList
    : JSONMember
        {{$$ = {}; $$[$1[0]] = $1[1];}}
    | JSONMemberList ',' JSONMember
        {$$ = $1; $1[$3[0]] = $3[1];}
    ;

JSONArray
    : '[' ']'
        {$$ = [];}
    | '[' JSONElementList ']'
        {$$ = $2;}
    ;

JSONElementList
    : JSONValue
        {$$ = [$1];}
    | JSONElementList ',' JSONValue
        {$$ = $1; $1.push($3);}
    ;

