import pandas as pd

# Load the CSV data
df = pd.read_csv('data/filtered_GDP_per_capita.csv')

# Melt the DataFrame from wide to long format
df_long = df.melt(id_vars=['Country', 'Country Code'], var_name='Year', value_name='GDPperCapita')

# Save the transformed DataFrame to a new CSV file
df_long.to_csv('transformed_data.csv', index=False)

print("Transformed CSV has been saved as 'transformed_data.csv'.")
