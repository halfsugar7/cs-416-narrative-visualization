import pandas as pd

# Read the original CSV file
df = pd.read_csv('data/GDP.csv')

# Define the list of countries to keep
countries_to_keep = [
    'United States', 'China', 'India', 'Germany', 'United Kingdom',
    'France', 'Brazil', 'Canada', 'Australia', 'Japan'
]

# Filter the DataFrame to only include rows with the specified countries
df_filtered = df[df['Country'].isin(countries_to_keep)]

# Rename 'United States' to 'USA' and 'United Kingdom' to 'UK'
df_filtered['Country'] = df_filtered['Country'].replace({
    'United States': 'USA',
    'United Kingdom': 'UK'
})

# Save the new DataFrame to a new CSV file
df_filtered.to_csv('filtered_data.csv', index=False)

print("Filtered CSV has been saved as 'filtered_data.csv'.")
