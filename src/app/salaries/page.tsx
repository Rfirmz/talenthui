'use client';

import { useState } from 'react';

export default function SalariesPage() {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // Salary data for the bar chart (in thousands)
  const salaryData = [
    { role: 'SWE Manager', aep: 260, pave: 227, cio: 165, sf: 318 },
    { role: 'CIO', aep: 225, pave: 220, cio: 200, sf: 219 },
    { role: 'Staff SWE', aep: 220, pave: 215, cio: 120, sf: 267 },
    { role: 'Sr. AI Eng', aep: 198, pave: 200, cio: null, sf: 240 },
    { role: 'Data Dir', aep: 210, pave: 245, cio: 150, sf: 290 },
    { role: 'ML Eng', aep: 195, pave: 215, cio: 150, sf: 213 },
  ];

  const maxSalary = 320;
  const yAxisLabels = ['$320K', '$280K', '$240K', '$200K', '$160K', '$120K', '$80K', '$40K', '$0'];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Salary Trends
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare compensation across Hawaii and mainland markets for top tech and leadership roles.
          </p>
        </div>

        {/* Vertical Bar Chart Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Average Salary Comparison</h2>
          <p className="text-gray-500 text-sm mb-6">Average base compensation by role and data source (in thousands USD)</p>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-6 mb-8 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-cyan-500"></div>
              <span className="text-sm text-gray-700">AEP Hawaii (2025)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-400"></div>
              <span className="text-sm text-gray-700">Pave (2025)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-400"></div>
              <span className="text-sm text-gray-700">CIO Council (2023)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-500"></div>
              <span className="text-sm text-gray-700">San Francisco</span>
            </div>
          </div>

          {/* Chart Container */}
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              <div className="flex">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between pr-3 text-right text-xs text-gray-500" style={{ height: '320px' }}>
                  {yAxisLabels.map((label, i) => (
                    <span key={i}>{label}</span>
                  ))}
                </div>

                {/* Chart Area */}
                <div className="flex-1 relative border-l border-b border-gray-300">
                  {/* Horizontal Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {yAxisLabels.map((_, i) => (
                      <div key={i} className="border-t border-gray-100 w-full"></div>
                    ))}
                  </div>

                  {/* Bars Container */}
                  <div className="relative flex justify-around items-end h-80 px-4">
                    {salaryData.map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        {/* Bars */}
                        <div className="flex items-end gap-1 h-72">
                          {/* AEP Hawaii Bar */}
                          <div 
                            className="relative w-6 bg-cyan-500 rounded-t transition-all duration-300 hover:bg-cyan-600 cursor-pointer"
                            style={{ height: `${(item.aep / maxSalary) * 288}px` }}
                            onMouseEnter={() => setHoveredBar(`${index}-aep`)}
                            onMouseLeave={() => setHoveredBar(null)}
                          >
                            {hoveredBar === `${index}-aep` && (
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                ${item.aep}K
                              </div>
                            )}
                          </div>
                          
                          {/* Pave Bar */}
                          <div 
                            className="relative w-6 bg-blue-400 rounded-t transition-all duration-300 hover:bg-blue-500 cursor-pointer"
                            style={{ height: `${(item.pave / maxSalary) * 288}px` }}
                            onMouseEnter={() => setHoveredBar(`${index}-pave`)}
                            onMouseLeave={() => setHoveredBar(null)}
                          >
                            {hoveredBar === `${index}-pave` && (
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                ${item.pave}K
                              </div>
                            )}
                          </div>
                          
                          {/* CIO Council Bar */}
                          {item.cio ? (
                            <div 
                              className="relative w-6 bg-gray-400 rounded-t transition-all duration-300 hover:bg-gray-500 cursor-pointer"
                              style={{ height: `${(item.cio / maxSalary) * 288}px` }}
                              onMouseEnter={() => setHoveredBar(`${index}-cio`)}
                              onMouseLeave={() => setHoveredBar(null)}
                            >
                              {hoveredBar === `${index}-cio` && (
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                  ${item.cio}K
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-6"></div>
                          )}
                          
                          {/* San Francisco Bar */}
                          <div 
                            className="relative w-6 bg-amber-500 rounded-t transition-all duration-300 hover:bg-amber-600 cursor-pointer"
                            style={{ height: `${(item.sf / maxSalary) * 288}px` }}
                            onMouseEnter={() => setHoveredBar(`${index}-sf`)}
                            onMouseLeave={() => setHoveredBar(null)}
                          >
                            {hoveredBar === `${index}-sf` && (
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                ${item.sf}K
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Role Label */}
                        <span className="mt-3 text-xs font-medium text-gray-700 text-center">{item.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Salary Ranges Table */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Salary Ranges by Role</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-cyan-600 text-white">
                  <th className="px-4 py-4 text-left font-semibold rounded-tl-lg">Role</th>
                  <th className="px-4 py-4 text-center font-semibold">AEP Hawaii (2025)</th>
                  <th className="px-4 py-4 text-center font-semibold">Pave (2025)</th>
                  <th className="px-4 py-4 text-center font-semibold">CIO Council (2023)</th>
                  <th className="px-4 py-4 text-center font-semibold rounded-tr-lg">San Francisco</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-cyan-50 transition-colors">
                  <td className="px-4 py-4 font-medium text-gray-900">Software Engineering Manager</td>
                  <td className="px-4 py-4 text-center text-gray-900">$220K–300K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$209K - $245K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$150K–$180K</td>
                  <td className="px-4 py-4 text-center text-gray-900">TC: $750K - $950K</td>
                </tr>
                <tr className="hover:bg-cyan-50 transition-colors bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">Chief Information Officer</td>
                  <td className="px-4 py-4 text-center text-gray-900">$200K–250K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$210K–$230K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$200K+</td>
                  <td className="px-4 py-4 text-center text-gray-900">TC: $450K - $650K</td>
                </tr>
                <tr className="hover:bg-cyan-50 transition-colors">
                  <td className="px-4 py-4 font-medium text-gray-900">Staff SWE (Fullstack/Backend)</td>
                  <td className="px-4 py-4 text-center text-gray-900">$190K–250K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$200K–$229K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$120K+</td>
                  <td className="px-4 py-4 text-center text-gray-900">TC: $350K - $450K</td>
                </tr>
                <tr className="hover:bg-cyan-50 transition-colors bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">Sr. Fullstack AI Engineer</td>
                  <td className="px-4 py-4 text-center text-gray-900">$170K–225K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$200K–$229K</td>
                  <td className="px-4 py-4 text-center text-gray-400">—</td>
                  <td className="px-4 py-4 text-center text-gray-900">TC: $250K - $350K</td>
                </tr>
                <tr className="hover:bg-cyan-50 transition-colors">
                  <td className="px-4 py-4 font-medium text-gray-900">Director of Data / Data Leader</td>
                  <td className="px-4 py-4 text-center text-gray-900">$200K–220K</td>
                  <td className="px-4 py-4 text-center text-gray-900">~$245K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$150K+</td>
                  <td className="px-4 py-4 text-center text-gray-900">TC: $400K - $600K</td>
                </tr>
                <tr className="hover:bg-cyan-50 transition-colors bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">Machine Learning Engineer</td>
                  <td className="px-4 py-4 text-center text-gray-900">$170K - $220K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$200K–$229K</td>
                  <td className="px-4 py-4 text-center text-gray-900">~$150K</td>
                  <td className="px-4 py-4 text-center text-gray-900">TC: $250-$400K</td>
                </tr>
                <tr className="hover:bg-cyan-50 transition-colors">
                  <td className="px-4 py-4 font-medium text-gray-900">Controller</td>
                  <td className="px-4 py-4 text-center text-gray-900">$175K–240K</td>
                  <td className="px-4 py-4 text-center text-gray-400">—</td>
                  <td className="px-4 py-4 text-center text-gray-400">—</td>
                  <td className="px-4 py-4 text-center text-gray-900">TC: $225K - $350K</td>
                </tr>
                <tr className="hover:bg-cyan-50 transition-colors bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">Director, Corporate Taxes</td>
                  <td className="px-4 py-4 text-center text-gray-900">$180K - 250K</td>
                  <td className="px-4 py-4 text-center text-gray-400">—</td>
                  <td className="px-4 py-4 text-center text-gray-400">—</td>
                  <td className="px-4 py-4 text-center text-gray-900">TC: $350K - $550K</td>
                </tr>
                <tr className="hover:bg-cyan-50 transition-colors">
                  <td className="px-4 py-4 font-medium text-gray-900">VP Sales & Marketing</td>
                  <td className="px-4 py-4 text-center text-gray-900">$195K–243K</td>
                  <td className="px-4 py-4 text-center text-gray-400">—</td>
                  <td className="px-4 py-4 text-center text-gray-400">—</td>
                  <td className="px-4 py-4 text-center text-gray-900">TC: $350K - $550K</td>
                </tr>
                <tr className="hover:bg-cyan-50 transition-colors bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">Senior Product Manager</td>
                  <td className="px-4 py-4 text-center text-gray-900">$180K - 250K</td>
                  <td className="px-4 py-4 text-center text-gray-400">—</td>
                  <td className="px-4 py-4 text-center text-gray-400">—</td>
                  <td className="px-4 py-4 text-center text-gray-900">TC: $280K - $450K</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Averages Table */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Average Compensation</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-cyan-600 text-white">
                  <th className="px-4 py-4 text-left font-semibold rounded-tl-lg">Role</th>
                  <th className="px-4 py-4 text-center font-semibold">AEP Hawaii (2025)</th>
                  <th className="px-4 py-4 text-center font-semibold">Pave (2025)</th>
                  <th className="px-4 py-4 text-center font-semibold">CIO Council (2023)</th>
                  <th className="px-4 py-4 text-center font-semibold rounded-tr-lg">San Francisco</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-cyan-50 transition-colors">
                  <td className="px-4 py-4 font-medium text-gray-900">Software Engineering Manager</td>
                  <td className="px-4 py-4 text-center text-gray-900">$260K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$227K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$165K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$318K</td>
                </tr>
                <tr className="hover:bg-cyan-50 transition-colors bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">Chief Information Officer</td>
                  <td className="px-4 py-4 text-center text-gray-900">$225K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$220K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$200K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$219K</td>
                </tr>
                <tr className="hover:bg-cyan-50 transition-colors">
                  <td className="px-4 py-4 font-medium text-gray-900">Staff SWE (Fullstack/Backend)</td>
                  <td className="px-4 py-4 text-center text-gray-900">$220K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$215K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$120K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$267K</td>
                </tr>
                <tr className="hover:bg-cyan-50 transition-colors bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">Sr. Fullstack AI Engineer</td>
                  <td className="px-4 py-4 text-center text-gray-900">$198K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$200K</td>
                  <td className="px-4 py-4 text-center text-gray-400">—</td>
                  <td className="px-4 py-4 text-center text-gray-900">$240K</td>
                </tr>
                <tr className="hover:bg-cyan-50 transition-colors">
                  <td className="px-4 py-4 font-medium text-gray-900">Director of Data / Data Leader</td>
                  <td className="px-4 py-4 text-center text-gray-900">$210K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$245K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$150K+</td>
                  <td className="px-4 py-4 text-center text-gray-900">$290K</td>
                </tr>
                <tr className="hover:bg-cyan-50 transition-colors bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">Machine Learning Engineer</td>
                  <td className="px-4 py-4 text-center text-gray-900">$195K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$215K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$150K</td>
                  <td className="px-4 py-4 text-center text-gray-900">$213K</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Sources */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Data</h2>
          <div className="prose text-gray-600">
            <p className="mb-4">
              This salary data is compiled from multiple trusted sources to give you a comprehensive view of compensation trends in Hawaii and how they compare to mainland markets.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>AEP Hawaii (2025)</strong> — Local market research and employer surveys</li>
              <li><strong>Pave (2025)</strong> — Real-time compensation benchmarking platform</li>
              <li><strong>CIO Council Hawaii (2023)</strong> — Hawaii government IT leadership data</li>
              <li><strong>San Francisco</strong> — Total Compensation (TC) including base, equity, and bonus</li>
            </ul>
            <p className="mt-4 text-sm text-gray-500">
              * TC = Total Compensation (base salary + equity + bonus). Hawaii salaries typically represent base compensation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
