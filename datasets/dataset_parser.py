import pandas as pd

fuel_consumption_df = pd.read_csv('fossil_fuels/fossil-fuel-consumption-by-type.csv')
price_index_df = pd.read_csv('fossil_fuels/fossil-fuel-price-index.csv')

print(price_index_df.to_string())

fuel_consumption_df_countries = fuel_consumption_df.Entity.unique()
print(fuel_consumption_df_countries)

def filter_country(cur_df, country):
    return(cur_df[cur_df['Entity']==country])

print(filter_country(fuel_consumption_df, "Slovakia"))

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

slovakia_fossil_fuel_df = slovak_price_index_df.join(filter_country(fuel_consumption_df, "Slovakia")[["Year", "Coal consumption - TWh", "Oil consumption - TWh", "Gas consumption - TWh"]].set_index("Year"), on="Year")

# Total price of energy = sum ( price * consumption )
# Total consumption = sum ( consumption )
# Total average price = total price / total consumption

slovakia_fossil_fuel_df["Total consumption - TWh"] = slovakia_fossil_fuel_df["Coal consumption - TWh"] + slovakia_fossil_fuel_df["Oil consumption - TWh"] + slovakia_fossil_fuel_df["Gas consumption - TWh"]

slovakia_fossil_fuel_df["Total price"] = (slovakia_fossil_fuel_df["Coal consumption - TWh"] * slovakia_fossil_fuel_df["Coal price"] + slovakia_fossil_fuel_df["Oil consumption - TWh"] * slovakia_fossil_fuel_df["Oil price"] + slovakia_fossil_fuel_df["Gas consumption - TWh"] * slovakia_fossil_fuel_df["Gas price"]) / slovakia_fossil_fuel_df["Total consumption - TWh"]




print(slovakia_fossil_fuel_df.to_string())
