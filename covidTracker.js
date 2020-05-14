/**
 * API URLS TO GET COVID-19 DATA
 * NB: THAT COUNTRY IS COUNTRY-SLUG
 * DATE FORMAT: 2020-03-01T00:00:00Z
 */

var covid = {
    globalSummary: "https://api.covid19api.com/summary",
    indiaData: "https://api.covid19india.org/data.json",
    indiaStateWise: "https://api.covid19india.org/state_district_wise.json",
    countryStatusConfirm: "https://api.covid19api.com/total/country/[[COUNTRY]]/status/confirmed",
    countryStatusTotal: "https://api.covid19api.com/country/[[COUNTRY]]?from=[[DATE1]]&to=[[DATE2]]",
}

module.exports = covid;