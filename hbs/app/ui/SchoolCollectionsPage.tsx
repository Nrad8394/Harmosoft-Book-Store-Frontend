import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getSchoolCollections } from "@/handler/Api"; // Your API handler function
export interface Collection {
    id: string;
    name: string;
    school: string;
    grade: string;
  }
interface SchoolCollectionsPageProps {
  schoolId: string;
  schoolName: string;
}

export default function SchoolCollectionsPage({ schoolId, schoolName }: SchoolCollectionsPageProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>("Loading collections...");
  const router = useRouter();

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      const data = await getSchoolCollections(schoolId);
      if (data) {
        setCollections(data.collection);
        setLoading(false);
      }
    };

    fetchCollections();
  }, [schoolId]);

  const filteredCollections = collections.filter((collection) =>
    selectedGrade === "ALL" ? true : collection.grade === selectedGrade
  );

  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade);
  };

  const renderCollections = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-green-700 rounded-lg shadow-md flex items-end space-x-4">
            <div className="bg-white flex items-center h-full p-3 ml-10 space-x-4">
              <div className="animate-spin rounded-full h-16 w-16 border-t-transparent border-solid border-8 border-green-700"></div>
              <p className="text-lg font-semibold text-green-700">{loadingMessage}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-4">
        {filteredCollections.map((collection) => (
          <div key={collection.id} className="bg-white rounded-lg shadow-md w-full md:w-1/2 lg:w-1/3 p-4">
            <h3 className="font-bold text-lg">{collection.name}</h3>
            <p>{`Grade: ${collection.grade}`}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderSidebar = () => (
    <div className="w-64 bg-gray-200 p-4">
      <h3 className="font-bold text-lg mb-4">Filter by Grade</h3>
      <ul>
        {[
          "ALL",
          "Play Group",
          "Pre-Primary 1",
          "Pre-Primary 2",
          "Grade 1",
          "Grade 2",
          "Grade 3",
          "Grade 4",
          "Grade 5",
          "Grade 6",
          "Grade 7",
          "Grade 8",
          "Grade 9",
          "Grade 10",
          "Grade 11",
          "Grade 12",
        ].map((grade) => (
          <li
            key={grade}
            className={`cursor-pointer p-2 ${
              selectedGrade === grade ? "bg-green-500 text-white" : ""
            }`}
            onClick={() => handleGradeChange(grade)}
          >
            {grade}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <main className="flex min-h-screen">
      {renderSidebar()}
      <div className="flex-grow p-4">
        <h2 className="text-2xl font-bold mb-6">{schoolName} Collections</h2>
        {renderCollections()}
      </div>
    </main>
  );
}
