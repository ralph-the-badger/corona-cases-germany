# Visualizing Corona virus cases in Germany over time for different age groups

## Description

This application visualizes the numbers of the Corona virus cases in Germany from calendar week (kw) 10 in 2020 to calendar week 4 in 2022 for different age groups. Shown are absolute numbers of Corona virus cases of each age group, as well as relative numbers of cases per age group.

## Data

The data used for this application are from the Robert-Koch-Institut (RKI). The RKI updates their numbers each week. The data can be retrieved [here](https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Altersverteilung.html).

The data was edited. The RKI's data includes age groups that span 5 years each: 0-4 year, 5-9 years, ..., 80-84 years, 85-90 years, 90+ years. In this analysis I added up two age groups to get the following age groups: 0-9 years, 10-19 years, ..., 80-89 years and 90+ Jahre. Furthermore, the absolute numbers of Corona cases of each age group were used to calculate the relative numbers of cases to figure out how severly each age group was affecting in the course of time.

This is data is only used for private use. It is not intended to use the data for commercial use.

## Stack

React, D3
