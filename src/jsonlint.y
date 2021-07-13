%start JSONText

/*
  ECMA-262 5th Edition, 15.12.1 The JSON Grammar.
*/


%%

JSONString
    : STRING
        { // replace escaped characters with actual character
	  $$ = yytext.replace(/\\([\"\\\/bfnrt]|u[0-9a-fA-f]{4})/g, function(match, part) {
	      if(part.charAt(0) === 'u') {
		return String.fromCharCode(parseInt(part.substr(1),16));
	      }
	      switch(part) {
	      case 'b':return '\b';
	      case 'f':return '\f';
	      case 'n':return '\n';
	      case 'r':return '\r';
	      case 't':return '\t';
	      case '"':case '\\':case '/':return part;
	      }
	    });
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

