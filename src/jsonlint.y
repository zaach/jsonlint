%start JSONText

/*
  ECMA-262 5th Edition, 15.12.1 The JSON Grammar.
*/


%%

JSONString
    : STRING
        { // replace escaped characters with actual character
          $$ = yytext.replace(/\\(\\|")/g, "$"+"1")
                     .replace(/\\n/g,'\n')
                     .replace(/\\r/g,'\r')
                     .replace(/\\t/g,'\t')
                     .replace(/\\v/g,'\v')
                     .replace(/\\f/g,'\f')
                     .replace(/\\b/g,'\b');
        }
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
    : JSONValue EOF
        {return $$ = $1;}
    ;

JSONValue
    : JSONNullLiteral
    | JSONBooleanLiteral
    | JSONString
    | JSONNumber
    | JSONObject
    | JSONArray
    ;

JSONObject
    : '{' '}'
        {$$ = {}; Object.defineProperty($$, '__line__', {
            value: @$.first_line,
            enumerable: false
        })}
    | '{' JSONMemberList '}'
        {$$ = $2; Object.defineProperty($$, '__line__', {
            value: @$.first_line,
            enumerable: false
        })}
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
        {$$ = []; Object.defineProperty($$, '__line__', {
            value: @$.first_line,
            enumerable: false
        })}
    | '[' JSONElementList ']'
        {$$ = $2; Object.defineProperty($$, '__line__', {
            value: @$.first_line,
            enumerable: false
        })}
    ;

JSONElementList
    : JSONValue
        {$$ = [$1];}
    | JSONElementList ',' JSONValue
        {$$ = $1; $1.push($3);}
    ;

