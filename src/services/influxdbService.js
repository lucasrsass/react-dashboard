const influxHost = 'http://192.168.0.46:8086';
const influxToken =
  'Z6F77HOg3bnHPBkEBEbK8Sugd_HrpfQkcVNaQXbotBEKp98Crcmzlp8YvZK6JxRtgniZCo2avmK4o3ulHj0ACQ==';
const influxOrg = 'matterhorn';
const influxBucket = 'rand-int';

export const fetchData = async () => {
  try {
    const query = `
      from(bucket: "${influxBucket}")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "rand_value")
    `;

    console.log('Sending query to InfluxDB:', query);

    const response = await fetch(
      `${influxHost}/api/v2/query?org=${influxOrg}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${influxToken}`,
          'Content-Type': 'application/vnd.flux',
          Accept: 'application/csv',
        },
        body: query,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
    }

    const dataText = await response.text();
    console.log('InfluxDB raw response:', dataText);

    // Parse CSV response
    const rows = dataText.trim().split('\n').slice(1); // Skip header
    const parsedData = rows
      .map((row) => {
        const [result, table, start, stop, time, value, field, measurement] =
          row.split(',');
        return { time, value: parseFloat(value), timestamp: time };
      })
      .filter((d) => d.time && d.value);

    if (parsedData.length > 0) {
      console.log('Parsed data:', parsedData);
      return parsedData;
    } else {
      console.warn('No data found in InfluxDB response');
      return [];
    }
  } catch (error) {
    console.error('Error fetching data from InfluxDB:', error);
    return [];
  }
};
