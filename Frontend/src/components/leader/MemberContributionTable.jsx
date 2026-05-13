import { Users, MapPin, TrendingUp } from "lucide-react";
import { flattenAllContributions } from "../../utils/transformContribution";

const MemberContributionTable = ({ contributions }) => {
  // Transform group-level contributions to individual farmer contributions
  const flattenedContributions = flattenAllContributions(contributions);

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <Users className="text-purple-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Member Contributions</h3>
          <p className="text-sm text-gray-600">Land contributions and participation</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Farmer</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Land (acres)</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Participation</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Est. Yield (qtl)</th>
            </tr>
          </thead>
          <tbody>
            {flattenedContributions.map((contribution) => (
              <tr key={contribution.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="text-blue-600" size={14} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {contribution.farmer?.fullName || contribution.farmerId || "Farmer"}
                      </p>
                      <p className="text-sm text-gray-500">
                        ID: {contribution.farmer?.farmerId || contribution.farmerId || "—"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-green-600" size={14} />
                    <span className="font-medium">{contribution.landSize || 0}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${contribution.percentage || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{contribution.percentage || 0}%</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-blue-600" size={14} />
                    <span className="font-medium">{contribution.estimatedCropSize || 0}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {flattenedContributions.length === 0 && (
        <div className="text-center py-8">
          <Users className="mx-auto text-gray-400 mb-2" size={24} />
          <p className="text-gray-500">No contributions recorded yet</p>
        </div>
      )}
    </div>
  );
};

export default MemberContributionTable;