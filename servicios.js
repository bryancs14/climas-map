const apiClima = "https://api.openweathermap.org/data/2.5/forecast?appid=456eb7bff8adb5539b0e6703c48ee2ca&units=metric&q=";

export const getDataClimaByCiudad = async (ciudad) => {
    const dataClimas = await axios.get(apiClima + ciudad);
    return dataClimas.data;
}