/**
 * API URLS TO GET COVID-19 DATA
 * NB: THAT COUNTRY IS COUNTRY-SLUG
 * DATE FORMAT: 2020-03-01T00:00:00Z
 */

var covid = {
    // GLOBAL DATA
    globalSummary: "https://api.covid19api.com/summary",
    countryStatusAll: "https://api.covid19api.com/total/country/[[COUNTRY]]",
    countryStatusTotal: "https://api.covid19api.com/country/[[COUNTRY]]?from=[[DATE1]]&to=[[DATE2]]",
    worldTotal: "https://api.covid19api.com/world/total",
    countryStatus: "https://covid19-api.org/api/status",
    // INDIA DATA
    indiaData: "https://api.covid19india.org/data.json",
    indiaStateWiseDistrictData: "https://api.covid19india.org/state_district_wise.json",
    indiaStateData: "https://covid-19india-api.herokuapp.com/state_data",
    indiaStateTimeLine: "https://covid-india-cases.herokuapp.com/statetimeline/",
    indiaHelpLine: "https://covid-19india-api.herokuapp.com/helpline_numbers",
    // IP DETAILS
    ipDetails: "http://ip-api.com/json/[[IP_ADDRESS]]?fields=61439",
}

module.exports = covid;
