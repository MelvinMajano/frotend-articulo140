import * as React from "react"

const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full text-sm text-left text-gray-600">{children}</div>
)

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="text-xs text-gray-700 uppercase bg-gray-50">{children}</thead>
)

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
)

const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="hover:bg-gray-50 transition-colors">{children}</tr>
)

const TableHead = ({ children }: { children: React.ReactNode }) => (
  <th scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">{children}</th>
)

const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="px-6 py-4 whitespace-nowrap">{children}</td>
)

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
