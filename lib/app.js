const stateCodeArr = [
    {
        state: 'andhra pradesh',
        code: 'AP'
    },
    {
        state: 'arunachal pradesh',
        code: 'AR'
    },
    {
        state: 'assam',
        code: 'AS',
    },
    {
        state: 'bihar',
        code: 'BR'
    },
    {
        state: 'chhattisgarh',
        code: 'CT'
    },
    {
        state: 'goa',
        code: 'GA'
    },
    {
        state: 'gujarat',
        code: 'GJ'
    },
    {
        state: 'haryana',
        code: 'HR'
    },
    {
        state: 'himachal pradesh',
        code: 'HP'
    },
    {
        state: 'jharkhand',
        code: 'JH'
    },
    {
        state: 'karnataka',
        code: 'KA'
    },
    {
        state: 'kerala',
        code: 'KL'
    },
    {
        state: 'madhya pradesh',
        code: 'MP'
    },
    {
        state: 'maharashtra',
        code: 'MH'
    },
    {
        state: 'manipur',
        code: 'MN'
    },
    {
        state: 'meghalaya',
        code: 'ML'
    },
    {
        state: 'mizoram',
        code: 'MZ'
    },
    {
        state: 'nagaland',
        code: 'NL'
    },
    {
        state: 'odisha',
        code: 'OR'
    },
    {
        state: 'punjab',
        code: 'PB'
    },
    {
        state: 'rajasthan',
        code: 'RJ'
    },
    {
        state: 'sikkim',
        code: 'SK'
    },
    {
        state: 'tamil nadu',
        code: 'TN'
    },
    {
        state: 'telangana',
        code: 'TG'
    },
    {
        state: 'telengana',
        code: 'TG'
    },
    {
        state: 'tripura',
        code: 'TR'
    },
    {
        state: 'uttarakhand',
        code: 'UT'
    },
    {
        state: 'uttar pradesh',
        code: 'UP'
    },
    {
        state: 'west bengal',
        code: 'WB'
    },
    {
        state: 'andaman and nicobar islands',
        code: 'AN'
    },
    {
        state: 'andaman and nicobar',
        code: 'AN'
    },
    {
        state: 'chandigarh',
        code: 'CH'
    },
    {
        state: 'dadra and nagar haveli',
        code: 'DN'
    },
    {
        state: 'daman and diu',
        code: 'DD'
    },
    {
        state: 'delhi',
        code: 'DL'
    },
    {
        state: 'jammu and kashmir',
        code: 'JK'
    },
    {
        state: 'ladakh',
        code: 'LA'
    },
    {
        state: 'lakshadweep',
        code: 'LD'
    },
    {
        state: 'puducherry',
        code: 'PY'
    },
]

/**
 * GET STATE ISO2 CODE FROM STATE NAME
 * @param state
 * @returns {string}
 */
exports.getStateCode = function(state){
    state = state.toLowerCase();
    for(let i in stateCodeArr){
        if(stateCodeArr[i].state === state) return (stateCodeArr[i].code);
    }
}

/**
 * GET STATE NAME FROM ISO2 STATE CODE
 * @param stateCode
 * @returns {string}
 */
exports.getStateName = function(stateCode){
    stateCode = stateCode.toUpperCase();
    for(let i in stateCodeArr){
        if(stateCodeArr[i].code === stateCode) return (stateCodeArr[i].state);
    }
}