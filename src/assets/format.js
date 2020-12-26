export const addComma = (n) => {
    if ( n === undefined )
        return;

    // account for decimals
    if ( !Number.isInteger(n) ){
        n = parseInt(n);
    }

    const COMMA = ',';
    let str = n.toString();
    let rem = str.length % 3;
    let output = ( typeof str !== 'string') ? str : str.slice(0, rem);

    for ( let i = rem; i < str.length; i += 3){
        if ( i === rem && rem === 0)
            output = output.concat( str.slice( i, i+3 ));
        else
            output = output.concat( COMMA, str.slice( i, i+3 ));
    }

    return output;
};