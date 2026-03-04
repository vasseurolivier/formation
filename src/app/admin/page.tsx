import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List, Upload, Image as ImageIcon, Film } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background p-4 pt-24 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">
              Admin Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Select an administrative tool to continue.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/course-generator">
                <Card className="hover:bg-accent transition-colors">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
                    <List className="w-8 h-8 text-primary" />
                    <CardTitle className="font-sans text-lg">Course Content Generator</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/admin/logo-uploader">
                <Card className="hover:bg-accent transition-colors">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
                      <Upload className="w-8 h-8 text-primary" />
                      <CardTitle className="font-sans text-lg">Logo Uploader</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/admin/hero-manager">
                <Card className="hover:bg-accent transition-colors">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
                        <Film className="w-8 h-8 text-primary" />
                        <CardTitle className="font-sans text-lg">Hero Media Manager</CardTitle>
                    </CardHeader>
                </Card>
              </Link>
              <Link href="/admin/image-manager">
                <Card className="hover:bg-accent transition-colors">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
                      <ImageIcon className="w-8 h-8 text-primary" />
                      <CardTitle className="font-sans text-lg">Website Image Manager</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
