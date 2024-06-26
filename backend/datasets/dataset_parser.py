import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

fuel_consumption_df = pd.read_csv('fossil_fuels/fossil-fuel-consumption-by-type.csv')
price_index_df = pd.read_csv('fossil_fuels/fossil-fuel-price-index.csv')

#print(price_index_df.to_string())

fuel_consumption_df_countries = fuel_consumption_df.Entity.unique()
#print(fuel_consumption_df_countries)

def filter_country(cur_df, country):
    return(cur_df[cur_df['Entity']==country])

#print(filter_country(fuel_consumption_df, "Slovakia"))

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

# Total price of energy = sum ( price * consumption )
# Total consumption = sum ( consumption )
# Total average price = total price / total consumption

slovakia_fossil_fuel_df["Total consumption - TWh"] = slovakia_fossil_fuel_df["Coal consumption - TWh"] + slovakia_fossil_fuel_df["Oil consumption - TWh"] + slovakia_fossil_fuel_df["Gas consumption - TWh"]

slovakia_fossil_fuel_df["Total price"] = (slovakia_fossil_fuel_df["Coal consumption - TWh"] * slovakia_fossil_fuel_df["Coal price"] + slovakia_fossil_fuel_df["Oil consumption - TWh"] * slovakia_fossil_fuel_df["Oil price"] + slovakia_fossil_fuel_df["Gas consumption - TWh"] * slovakia_fossil_fuel_df["Gas price"]) / slovakia_fossil_fuel_df["Total consumption - TWh"]



historic_data_df = pd.read_csv("fossil_fuels/historic_data_csv.csv")
historic_data_df = historic_data_df[historic_data_df["year"] >= first_year]

color1 = "red"
color2 = "blue"

fig, ax1 = plt.subplots()
plt.title("DOstanes na hubu")
ax1.set_xlabel("Year")
"""ax1.set_ylabel("Total consumption [TWh]", color = color1)
ax1.plot(slovakia_fossil_fuel_df["Year"], slovakia_fossil_fuel_df["Total consumption - TWh"], color = color1)
ax1.tick_params(axis='y', labelcolor=color1)"""
ax1.set_ylabel("Total cum. fossil market turnover [USD]", color = color1)
ax1.plot(slovakia_fossil_fuel_df["Year"], np.cumsum(slovakia_fossil_fuel_df["Total consumption - TWh"] * slovakia_fossil_fuel_df["Total price"]), color = color1)
ax1.tick_params(axis='y', labelcolor=color1)

ax2 = ax1.twinx()
ax2.set_ylabel("Average temp. [deg. C]", color = color2)
ax2.plot(historic_data_df["year"], historic_data_df["temperature"], color = color2)
ax2.tick_params(axis='y', labelcolor=color2)

fig.tight_layout()
plt.show()

total_temp_dif = np.array(historic_data_df["temperature"])[-1] - np.array(historic_data_df["temperature"])[0]
total_price = np.sum(slovakia_fossil_fuel_df["Total consumption - TWh"] * slovakia_fossil_fuel_df["Total price"])

total_price_per_degree_celsius = total_price / total_temp_dif

print("-----------------------------------------------------")
print(f"--- It costs {int(np.floor(total_price_per_degree_celsius / 1000000000000))} trillion dollars to raise ----")
print("--- the Earth's temperature by one degree Celsius ---")
print("-----------------------------------------------------")

last_year_turnover = np.array(slovakia_fossil_fuel_df["Total consumption - TWh"] * slovakia_fossil_fuel_df["Total price"])[-1]
def cost_of_temp_lowering(target_temperature_increase, number_of_years):
    # calculates the loss of turnover in the fossil fuel industry needed to restrict the temperature raise in the given number of years
    # assuming the turnover staying constant
    target_turnover = last_year_turnover * number_of_years
    projected_temperature_increase = target_turnover / total_price_per_degree_celsius
    temperature_difference = projected_temperature_increase - target_temperature_increase
    if temperature_difference <= 0:
        # no loss of turnover
        return(0)
    return(total_price_per_degree_celsius * temperature_difference)

temp_inc = 2.0
c_years = 20

print("-----------------------------------------------------")
print(f"--- It would cost {int(np.floor(cost_of_temp_lowering(temp_inc, c_years) / 1000000000000))} trillion dollars in fossil fuel ----")
print(f"--- industry turnover to restrict the temperature increase to {temp_inc} deg. Celsius in the next {c_years} years. ---")
print("-----------------------------------------------------")

prediction_data_df = pd.read_csv("fossil_fuels/predictinos_temp.csv")

prediction_year_scale = np.array(prediction_data_df["year"]) - np.array(prediction_data_df["year"])[0]

plt.title("The financial loss of fossil fuel industry turnover")
plt.xlabel("Year")
plt.ylabel("Trillions USD")

number_of_scenarios = 3
for i in range(1, number_of_scenarios + 1):
    s_label = "scenario" + str(i)
    cur_cumulative_cost = []
    for j in range(len(np.array(prediction_data_df[s_label]))):
        cur_cumulative_cost.append(cost_of_temp_lowering(np.array(prediction_data_df[s_label])[j] - np.array(prediction_data_df[s_label])[0], prediction_year_scale[j]))
    plt.plot(prediction_data_df["year"], np.array(cur_cumulative_cost) / 1000000000000, label = "Scenario " + str(i))

plt.legend()
plt.show()



