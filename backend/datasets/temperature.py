import pandas as pd
import numpy as np
import os

def cost_of_temp_lowering(target_temperature_increase, number_of_years):
    fuel_consumption_df = pd.read_csv(os.path.dirname(__file__) + '/fossil_fuels/fossil-fuel-consumption-by-type.csv')
    price_index_df = pd.read_csv(os.path.dirname(__file__) + '/fossil_fuels/fossil-fuel-price-index.csv')

    def filter_country(cur_df, country):
        return(cur_df[cur_df['Entity']==country])

    first_year = 1987
    coal_price_reference = 91.83 # USD / metric ton, https://ycharts.com/indicators/northwest_europe_coal_marker_price
    oil_price_reference = 71.34 / 159 # USD / litre
    gas_price_reference = 1.65 # USD / litre

    coal_heating_capacity = 0.02 / 3600 # TWh / metric ton
    oil_heating_capacity = 0.000045 / 3600 * 0.9 # TWh / litre
    gas_heating_capacity = 0.000048 / 3600 * 0.9 # TWh / litre


    coal_price_df = price_index_df[price_index_df["Entity"]=="Northwest Europe"][price_index_df["Year"] >= first_year][["Year","Coal price index"]]
    oil_price_df = price_index_df[price_index_df["Entity"]=="Brent"][price_index_df["Year"] >= first_year][["Year","Oil spot crude price index"]]
    gas_price_df = price_index_df[price_index_df["Entity"]=="Average German import price"][price_index_df["Year"] >= first_year][["Year","Gas price index"]]

    # setting price to USD / TWh
    coal_price_df["Coal price index"] = coal_price_df["Coal price index"].apply(lambda x: x * coal_price_reference / coal_heating_capacity)
    coal_price_df = coal_price_df.rename(columns={"Coal price index" : "Coal price"})
    oil_price_df["Oil spot crude price index"] = oil_price_df["Oil spot crude price index"].apply(lambda x: x * oil_price_reference / oil_heating_capacity)
    oil_price_df = oil_price_df.rename(columns={"Oil spot crude price index" : "Oil price"})
    gas_price_df["Gas price index"] = gas_price_df["Gas price index"].apply(lambda x: x * gas_price_reference / gas_heating_capacity)
    gas_price_df = gas_price_df.rename(columns={"Gas price index" : "Gas price"})


    slovak_price_index_df = coal_price_df.join(oil_price_df.set_index("Year"), on="Year").join(gas_price_df.set_index("Year"), on="Year")

    slovakia_fossil_fuel_df = slovak_price_index_df.join(filter_country(fuel_consumption_df, "World")[["Year", "Coal consumption - TWh", "Oil consumption - TWh", "Gas consumption - TWh"]].set_index("Year"), on="Year")

    
    slovakia_fossil_fuel_df["Total consumption - TWh"] = slovakia_fossil_fuel_df["Coal consumption - TWh"] + slovakia_fossil_fuel_df["Oil consumption - TWh"] + slovakia_fossil_fuel_df["Gas consumption - TWh"]
    slovakia_fossil_fuel_df["Total price"] = (slovakia_fossil_fuel_df["Coal consumption - TWh"] * slovakia_fossil_fuel_df["Coal price"] + slovakia_fossil_fuel_df["Oil consumption - TWh"] * slovakia_fossil_fuel_df["Oil price"] + slovakia_fossil_fuel_df["Gas consumption - TWh"] * slovakia_fossil_fuel_df["Gas price"]) / slovakia_fossil_fuel_df["Total consumption - TWh"]



    historic_data_df = pd.read_csv(os.path.dirname(__file__) + "/fossil_fuels/historic_data_csv.csv")
    historic_data_df = historic_data_df[historic_data_df["year"] >= first_year]
    
    total_temp_dif = np.array(historic_data_df["temperature"])[-1] - np.array(historic_data_df["temperature"])[0]
    total_price = np.sum(slovakia_fossil_fuel_df["Total consumption - TWh"] * slovakia_fossil_fuel_df["Total price"])

    total_price_per_degree_celsius = total_price / total_temp_dif
    
    last_year_turnover = np.array(slovakia_fossil_fuel_df["Total consumption - TWh"] * slovakia_fossil_fuel_df["Total price"])[-1]
    # calculates the loss of turnover in the fossil fuel industry needed to restrict the temperature raise in the given number of years
    # assuming the turnover staying constant
    target_turnover = last_year_turnover * number_of_years
    projected_temperature_increase = target_turnover / total_price_per_degree_celsius
    temperature_difference = projected_temperature_increase - target_temperature_increase
    if temperature_difference <= 0:
        # no loss of turnover
        return 0
    return total_price_per_degree_celsius * temperature_difference