import { Router } from 'express';
import Delivery from '../models/Delivery.js';

const router = Router();

// Get delivery recommendations for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const deliveries = await Delivery.find({ userId });

    if (deliveries.length === 0) {
      return res.json({
        message: 'No delivery data found. Start adding deliveries to get recommendations!',
        recommendations: {
          bestTimes: [],
          bestAreas: [],
          avoidAreas: [],
          avoidTimes: [],
          insights: []
        }
      });
    }

    const recommendations = analyzeDeliveries(deliveries);
    
    res.json({
      recommendations,
      totalDeliveries: deliveries.length,
      dateRange: {
        earliest: new Date(Math.min(...deliveries.map(d => new Date(d.date)))),
        latest: new Date(Math.max(...deliveries.map(d => new Date(d.date))))
      }
    });

  } catch (err) {
    console.error('Recommendations error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Analyze delivery data and generate recommendations
function analyzeDeliveries(deliveries) {
  // Group deliveries by hour
  const hourlyStats = {};
  const areaStats = {};
  const dayOfWeekStats = {};

  deliveries.forEach(delivery => {
    // Parse time and extract hour
    const time = delivery.time || '00:00';
    const hour = parseInt(time.split(':')[0]);
    const dayOfWeek = new Date(delivery.date).getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Initialize stats objects
    if (!hourlyStats[hour]) {
      hourlyStats[hour] = { total: 0, tips: 0, count: 0 };
    }
    if (!dayOfWeekStats[dayOfWeek]) {
      dayOfWeekStats[dayOfWeek] = { total: 0, tips: 0, count: 0 };
    }

    // Aggregate area stats (using first part of address as area)
    const area = delivery.address.split(',')[0].trim();
    if (!areaStats[area]) {
      areaStats[area] = { total: 0, tips: 0, count: 0 };
    }

    // Add to stats
    hourlyStats[hour].total += delivery.total || 0;
    hourlyStats[hour].tips += delivery.tip || 0;
    hourlyStats[hour].count += 1;

    dayOfWeekStats[dayOfWeek].total += delivery.total || 0;
    dayOfWeekStats[dayOfWeek].tips += delivery.tip || 0;
    dayOfWeekStats[dayOfWeek].count += 1;

    areaStats[area].total += delivery.total || 0;
    areaStats[area].tips += delivery.tip || 0;
    areaStats[area].count += 1;
  });

  // Calculate averages and find best/worst
  const hourlyAverages = Object.entries(hourlyStats).map(([hour, stats]) => ({
    hour: parseInt(hour),
    avgTip: stats.count > 0 ? stats.tips / stats.count : 0,
    avgTotal: stats.count > 0 ? stats.total / stats.count : 0,
    count: stats.count,
    totalEarnings: stats.tips
  }));

  const dayAverages = Object.entries(dayOfWeekStats).map(([day, stats]) => ({
    day: parseInt(day),
    dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day],
    avgTip: stats.count > 0 ? stats.tips / stats.count : 0,
    avgTotal: stats.count > 0 ? stats.total / stats.count : 0,
    count: stats.count,
    totalEarnings: stats.tips
  }));

  const areaAverages = Object.entries(areaStats).map(([area, stats]) => ({
    area,
    avgTip: stats.count > 0 ? stats.tips / stats.count : 0,
    avgTotal: stats.count > 0 ? stats.total / stats.count : 0,
    count: stats.count,
    totalEarnings: stats.tips
  }));

  // Sort by average tip
  hourlyAverages.sort((a, b) => b.avgTip - a.avgTip);
  dayAverages.sort((a, b) => b.avgTip - a.avgTip);
  areaAverages.sort((a, b) => b.avgTip - a.avgTip);

  // Generate recommendations
  const bestTimes = hourlyAverages.slice(0, 3).map(h => ({
    hour: h.hour,
    avgTip: h.avgTip,
    count: h.count,
    recommendation: `Work around ${h.hour}:00 for best tips (avg $${h.avgTip.toFixed(2)})`
  }));

  const bestDays = dayAverages.slice(0, 3).map(d => ({
    day: d.day,
    dayName: d.dayName,
    avgTip: d.avgTip,
    count: d.count,
    recommendation: `${d.dayName}s are your best day (avg $${d.avgTip.toFixed(2)} tip)`
  }));

  const bestAreas = areaAverages.slice(0, 3).map(a => ({
    area: a.area,
    avgTip: a.avgTip,
    count: a.count,
    recommendation: `Focus on ${a.area} area (avg $${a.avgTip.toFixed(2)} tip)`
  }));

  const avoidTimes = hourlyAverages.slice(-3).reverse().map(h => ({
    hour: h.hour,
    avgTip: h.avgTip,
    count: h.count,
    recommendation: `Avoid working around ${h.hour}:00 (avg $${h.avgTip.toFixed(2)} tip)`
  }));

  const avoidAreas = areaAverages.slice(-3).reverse().map(a => ({
    area: a.area,
    avgTip: a.avgTip,
    count: a.count,
    recommendation: `Avoid ${a.area} area (avg $${a.avgTip.toFixed(2)} tip)`
  }));

  // Generate insights
  const insights = generateInsights(deliveries, hourlyAverages, dayAverages, areaAverages);

  return {
    bestTimes,
    bestDays,
    bestAreas,
    avoidTimes,
    avoidAreas,
    insights,
    stats: {
      totalDeliveries: deliveries.length,
      totalEarnings: deliveries.reduce((sum, d) => sum + (d.tip || 0), 0),
      avgTip: deliveries.reduce((sum, d) => sum + (d.tip || 0), 0) / deliveries.length,
      bestHour: hourlyAverages[0]?.hour,
      bestDay: dayAverages[0]?.dayName,
      bestArea: areaAverages[0]?.area
    }
  };
}

// Generate additional insights
function generateInsights(deliveries, hourlyAverages, dayAverages, areaAverages) {
  const insights = [];
  
  // Tip percentage analysis
  const tipPercentages = deliveries
    .filter(d => d.total > 0)
    .map(d => (d.tip / d.total) * 100);
  
  if (tipPercentages.length > 0) {
    const avgTipPercentage = tipPercentages.reduce((a, b) => a + b, 0) / tipPercentages.length;
    insights.push(`Your average tip percentage is ${avgTipPercentage.toFixed(1)}%`);
  }

  // Peak hours insight
  if (hourlyAverages.length > 0) {
    const bestHour = hourlyAverages[0];
    const worstHour = hourlyAverages[hourlyAverages.length - 1];
    if (bestHour.avgTip > worstHour.avgTip * 1.5) {
      insights.push(`Tips are ${(bestHour.avgTip / worstHour.avgTip).toFixed(1)}x higher at ${bestHour.hour}:00 vs ${worstHour.hour}:00`);
    }
  }

  // Weekend vs weekday analysis
  const weekendDays = [0, 6]; // Sunday and Saturday
  const weekdayDeliveries = deliveries.filter(d => !weekendDays.includes(new Date(d.date).getDay()));
  const weekendDeliveries = deliveries.filter(d => weekendDays.includes(new Date(d.date).getDay()));
  
  if (weekendDeliveries.length > 0 && weekdayDeliveries.length > 0) {
    const weekdayAvgTip = weekdayDeliveries.reduce((sum, d) => sum + (d.tip || 0), 0) / weekdayDeliveries.length;
    const weekendAvgTip = weekendDeliveries.reduce((sum, d) => sum + (d.tip || 0), 0) / weekendDeliveries.length;
    
    if (weekendAvgTip > weekdayAvgTip * 1.2) {
      insights.push(`Weekend tips are ${(weekendAvgTip / weekdayAvgTip).toFixed(1)}x higher than weekdays`);
    }
  }

  // Consistency insight
  const tipVariance = deliveries.reduce((sum, d) => sum + Math.pow((d.tip || 0) - (deliveries.reduce((s, dd) => s + (dd.tip || 0), 0) / deliveries.length), 2), 0) / deliveries.length;
  if (tipVariance < 5) {
    insights.push("Your tips are very consistent - great job!");
  } else if (tipVariance > 20) {
    insights.push("Your tips vary significantly - consider focusing on your best areas/times");
  }

  return insights;
}

export default router; 